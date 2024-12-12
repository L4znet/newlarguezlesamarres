import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"
import { undefined } from "zod"

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity | undefined> {
          const { data: boatData, error: boatError } = await supabase
               .from("boats")
               .insert({
                    profile_id,
                    boat_name: boatName,
                    boat_description: boatDescription,
                    boat_capacity: boatCapacity,
                    boat_type: boatType,
               })
               .select()

          if (boatError) {
               throw new Error(`Error creating boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }

          throw new Error("No data returned from boat creation.")
     }

     async updateBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined> {
          const boatIdString = boatId

          const { data: boatData, error: boatError } = await supabase
               .from("boats")
               .update({
                    profile_id,
                    boat_name: boatName,
                    boat_description: boatDescription,
                    boat_capacity: boatCapacity,
                    boat_type: boatType,
               })
               .eq("id", boatIdString)
               .select()

          if (boatError) {
               throw new Error(`Error updating boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }

          throw new Error("No data returned from boat update.")
     }

     async uploadImages(boatId: string | undefined, images: any[]): Promise<void> {
          try {
               for (const [index, image] of images.entries()) {
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
                         is_default: index === 0,
                         base64: image.base64,
                    })

                    console.log(data, error)
               }
          } catch (error) {
               throw new Error(`Error in uploadImages: ${(error as Error).message}`)
          }
     }

     async deleteBoat(profile_id: string | undefined, boatId: string): Promise<BoatEntity | undefined> {
          const boatIdString = boatId

          const { data: boatData, error: boatError } = await supabase.from("boats").delete().eq("id", boatIdString).eq("profile_id", profile_id).select()

          if (boatError) {
               throw new Error(`Error deleting boat: ${boatError.message}`)
          }

          if (boatData?.length) {
               return BoatEntity.fromSupabaseData(boatData[0])
          }

          throw new Error("No data returned from boat deletion.")
     }

     async updateImages(
          boatId: string | undefined,
          images: {
               fileName: string | undefined | null
               isDefault: boolean
               size: number
               base64: string
               caption: string
               mimeType: string
               contentType: string
               dimensions: { width: number; height: number }
          }[]
     ): Promise<void> {
          try {
               await this.deleteBoatImages(boatId)
               await this.uploadImages(boatId, images)
          } catch (error) {
               throw new Error(`Error in updateImages: ${(error as Error).message}`)
          }
     }

     async deleteBoatImages(boatId: string | undefined): Promise<void> {
          try {
               const { data: oldImages, error: fetchError } = await supabase.from("boat_images").select("url").eq("boat_id", boatId)

               if (fetchError) {
                    throw new Error(`Error fetching old images: ${fetchError.message}`)
               }

               if (oldImages?.length > 0) {
                    const imagePaths = oldImages.map((image) => `thumbnails/${image.url.split("/").pop()}`)
                    await supabase.storage.from("boats-images").remove(imagePaths)
                    await supabase.from("boat_images").delete().eq("boat_id", boatId)
               }
          } catch (error) {
               throw new Error(`Error in deleteBoatImages: ${(error as Error).message}`)
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
                    .eq("profile_id", profile_id)

               if (boatError) {
                    throw new Error(`Error getting boats: ${boatError.message}`)
               }

               if (boatData) {
                    return boatData.map((boat: any) => BoatEntity.fromSupabaseData(boat))
               }

               return []
          } catch (error) {
               throw new Error(`Error in getBoats: ${(error as Error).message}`)
          }
     }

     async getSingleBoat(boatId: string | string[]): Promise<BoatEntity> {
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
                    return BoatEntity.fromSupabaseData(boatData)
               }

               throw new Error("No data returned from boat query.")
          } catch (error) {
               throw new Error(`Error in getSingleBoat: ${(error as Error).message}`)
          }
     }
}

export default new BoatRepositorySupabase()
