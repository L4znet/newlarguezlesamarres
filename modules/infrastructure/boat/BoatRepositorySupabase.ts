import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"
import { undefined } from "zod"
import { CreateBoatDTO } from "@/modules/domain/boats/DTO/CreateBoatDTO"
import { CreateBoatImageDTO } from "@/modules/domain/boats/DTO/CreateBoatImageDTO"
import { BoatRawData, GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"
import { GetSingleBoatDTO } from "@/modules/domain/boats/DTO/GetSingleBoat"

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(profileId: string, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity | undefined> {
          const createBoatDTO = new CreateBoatDTO({
               profile_id: profileId,
               boat_name: boatName,
               boat_description: boatDescription,
               boat_capacity: boatCapacity,
               boat_type: boatType,
          })

          const { data: boatData, error: boatError } = await supabase.from("boats").insert(CreateBoatDTO.toRawData(createBoatDTO)).select()

          if (boatError) {
               throw new Error(`Error creating boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }

          throw new Error("No data returned from boat creation.")
     }

     async updateBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined> {
          console.log("boatId", boatId)

          const { data: boatData, error: boatError } = await supabase
               .from("boats")
               .update({
                    boat_name: boatName,
                    boat_description: boatDescription,
                    boat_capacity: boatCapacity,
                    boat_type: boatType,
               })
               .eq("id", boatId)
               .select()

          if (boatError) {
               throw new Error(`Error updating boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }
     }

     async uploadImages(boatId: string, images: any[]): Promise<void> {
          try {
               for (const [index, image] of images.entries()) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = `${randomName}-${(image.fileName || "default").toLowerCase().replace(/_/g, "-")}`

                    const { data: uploadData, error: uploadError } = await supabase.storage.from("boats-images").upload(`thumbnails/${fileName}`, decode(image.base64), {
                         contentType: image.mimeType,
                    })

                    if (!uploadError && uploadData) {
                         const publicUrl = supabase.storage.from("boats-images").getPublicUrl(uploadData.path).data.publicUrl

                         const createBoatImageDTO = new CreateBoatImageDTO({
                              url: publicUrl,
                              is_default: image.isDefault,
                              caption: image.caption,
                              content_type: image.contentType,
                              base64: image.base64,
                              dimensions: image.dimensions,
                              size: image.size,
                              mime_type: image.mimeType,
                              file_name: image.fileName,
                              boat_id: boatId,
                         })

                         const { data, error } = await supabase.from("boat_images").insert(CreateBoatImageDTO.toRawData(createBoatImageDTO))
                    }
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async uploadUpdateImages(boatId: string | undefined, newImages: any[]): Promise<void> {
          console.log("newImages", newImages)

          const { data: oldImages, error: fetchError } = await supabase.from("boat_images").select("url").eq("boat_id", boatId)

          if (fetchError) {
               throw new Error(`Error fetching old images: ${fetchError.message}`)
          }

          if (oldImages) {
               if (oldImages?.length > 0) {
                    const imagePaths = oldImages.map((image) => `thumbnails/${image.url.split("/").pop()}`)
                    await supabase.storage.from("boats-images").remove(imagePaths)
                    await supabase.from("boat_images").delete().eq("boat_id", boatId)
               }
          }

          try {
               for (const image of newImages) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = `${randomName}-${(image.fileName || "default").toLowerCase().replace(/_/g, "-")}`

                    const { data: uploadData, error: uploadError } = await supabase.storage.from("boats-images").upload(`thumbnails/${fileName}`, decode(image.base64), {
                         contentType: image.mimeType,
                    })

                    if (uploadError) throw new Error(`Error uploading image: ${uploadError.message}`)

                    const publicUrl = supabase.storage.from("boats-images").getPublicUrl(uploadData.path).data.publicUrl

                    const { data, error } = await supabase.from("boat_images").insert({
                         boat_id: boatId,
                         url: publicUrl,
                         caption: image.caption,
                         content_type: image.contentType,
                         dimensions: image.dimensions,
                         size: image.size,
                         mime_type: image.mimeType,
                         file_name: fileName,
                         is_default: image.isDefault,
                         base64: image.base64,
                    })
               }
          } catch (error) {
               throw new Error(`Error in uploadImages: ${(error as Error).message}`)
          }
     }

     async deleteBoat(profileId: string | undefined, boatId: string): Promise<BoatEntity | undefined> {
          const { data: boatData, error: boatError } = await supabase.from("boats").delete().eq("id", boatId).eq("profile_id", profileId).select()

          if (boatError) {
               throw new Error(`Error deleting boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }

          throw new Error("No data returned from boat deletion.")
     }

     async getBoats(profileId: string | undefined): Promise<GetBoatsDTO[] | undefined> {
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
                    .order("created_at", {
                         ascending: false,
                    })
                    .eq("profile_id", profileId)

               if (boatError) {
                    throw new Error(`Error getting boats: ${boatError.message}`)
               }

               if (boatData) {
                    console.log("boatData", boatData)

                    return boatData.map((boat: BoatRawData) => {
                         console.log("boat", boat)

                         return GetBoatsDTO.fromRawData(boat)
                    })
               }

               return []
          } catch (error) {
               throw new Error(`Error in getBoats: ${(error as Error).message}`)
          }
     }

     async getSingleBoat(boatId: string | string[]): Promise<GetSingleBoatDTO> {
          try {
               const boatIdString = Array.isArray(boatId) ? boatId[0] : boatId

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
                        caption,
                        content_type,
                        base64,
                        dimensions,
                        size,
                        mime_type,
                        file_name
                    )
                `
                    )
                    .eq("id", boatIdString)
                    .single()

               if (boatError) {
                    throw new Error(`Error getting boat: ${boatError.message}`)
               }

               if (boatData) {
                    return GetSingleBoatDTO.fromRawData(boatData)
               }

               throw new Error("No data returned from boat query.")
          } catch (error) {
               throw new Error(`Error in getSingleBoat: ${(error as Error).message}`)
          }
     }
     async getBoatsCount(profileId: string | undefined): Promise<Number | null> {
          try {
               const { count, error } = await supabase.from("boats").select("*", { count: "exact", head: true }).eq("profile_id", profileId).limit(1)
               if (error) {
                    console.log("boatError", error)
                    throw new Error(`Error getting boats: ${error.message}`)
               }

               return count
          } catch (error) {
               console.log("error", error)

               throw new Error(`Error in getBoats: ${(error as Error).message}`)
          }
     }
}

export default new BoatRepositorySupabase()
