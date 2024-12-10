import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"
import { Boat } from "@/modules/domain/boats/schemas/BoatSchema"

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity | undefined> {
          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .insert({
                         profile_id: profile_id,
                         boat_name: boatName,
                         boat_type: boatType,
                         boat_description: boatDescription,
                         boat_capacity: boatCapacity,
                    })
                    .select()

               if (boatData) {
                    return new BoatEntity(boatData[0].profile_id, boatData[0].boat_name, boatData[0].boat_description, boatData[0].boat_capacity, boatData[0].boat_type, boatData[0].id)
               }

               if (boatError) {
                    console.log("boatError", boatError)
                    throw new Error(`Error adding boat: ${boatError.message}`)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async editBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined> {
          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .update({
                         profile_id: profile_id,
                         boat_name: boatName,
                         boat_type: boatType,
                         boat_description: boatDescription,
                         boat_capacity: boatCapacity,
                    })
                    .eq("id", boatId)
                    .select()

               if (boatData) {
                    return new BoatEntity(boatData[0].profile_id, boatData[0].boat_name, boatData[0].boat_description, boatData[0].boat_capacity, boatData[0].boat_type, boatData[0].id)
               }

               if (boatError) {
                    console.log("boatError", boatError)
                    throw new Error(`Error updating boat: ${boatError.message}`)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async getSingleBoat(boatId: string | string[]): Promise<BoatEntity | undefined> {
          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .select(
                         `
                   id,
                   profile_id,
                   boat_name,
                   boat_description,
                   boat_capacity,
                   boat_type,
                   boat_images (
                       id,
                       url,
                       boat_id,
                       is_default,
                       caption
                     )
                       `
                    )
                    .eq("id", boatId)
                    .single()

               if (boatData) {
                    return new BoatEntity(boatData.profile_id, boatData.boat_name, boatData.boat_description, boatData.boat_capacity, boatData.boat_type, boatData.id, boatData.boat_images)
               }

               if (boatError) {
                    console.log("boatError", boatError)
                    throw new Error(`Error getting boat: ${boatError.message}`)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async getBoats(profile_id: string | undefined): Promise<BoatEntity[] | undefined> {
          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .select(
                         `
                id,
                profile_id,
                boat_name,
                boat_description,
                boat_capacity,
                boat_type,
                boat_images (
                    id,
                    url,
                    boat_id,
                    is_default,
                    caption
                )
            `
                    )
                    .eq("profile_id", profile_id)

               if (boatError) {
                    console.log("boatError", boatError)
                    throw new Error(`Error getting boats: ${boatError.message}`)
               }

               if (boatData) {
                    const boats = boatData.map((boat: any) => BoatEntity.fromSupabaseData(boat))
                    return boats
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async uploadAndUpsertImages(boatId: string | undefined, images: Boat["boatImages"]): Promise<void> {
          try {
               const uploadedImages = [] as { id: string; fullPath: string; path: string; caption: string }[]

               for (const image of images) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = randomName + "-" + image.fileName?.toLowerCase().split("_").join("-")
                    const { data, error } = await supabase.storage.from("boats-images").upload("thumbnails/" + fileName, decode(image.base64), {
                         contentType: "image/png",
                         upsert: true,
                    })

                    if (error) {
                         throw new Error(`Error uploading image: ${error.message}`)
                    }

                    try {
                         if (data && fileName) {
                              uploadedImages.push({
                                   id: data?.id,
                                   fullPath: data.fullPath,
                                   path: data?.path,
                                   caption: fileName,
                              })
                              console.log("uploadedImages", uploadedImages.length)
                         }
                    } catch (error) {
                         console.error("Error uploading image:", error)
                    }
               }

               for (const [index, image] of uploadedImages.entries()) {
                    const publicUrl = supabase.storage.from("boats-images").getPublicUrl(image.path).data.publicUrl
                    let isDefault = false

                    if (index === 0) {
                         isDefault = true
                    }
                    const { data, error: insertError } = await supabase.from("boat_images").upsert({
                         boat_id: boatId,
                         url: publicUrl,
                         caption: image.caption,
                         is_default: isDefault,
                    })
                    console.log("insertError", insertError)
                    console.log("data", data)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }
}

export default new BoatRepositorySupabase()
