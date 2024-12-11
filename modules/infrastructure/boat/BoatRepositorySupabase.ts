import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"

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
          const boatIdString = Array.isArray(boatId) ? boatId[0] : boatId

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
               // Supprime les anciennes images et leurs entrées dans la base de données
               const { data: oldImages, error: fetchError } = await supabase.from("boat_images").select("url").eq("boat_id", boatId)
               if (fetchError) throw new Error(`Error fetching old images: ${fetchError.message}`)

               if (oldImages) {
                    for (const image of oldImages) {
                         const path = "thumbnails/" + image.url.split("/").pop()
                         await supabase.storage.from("boats-images").remove(path)
                    }
                    await supabase.from("boat_images").delete().eq("boat_id", boatId)
               }

               // Upload des nouvelles images une par une
               for (const [index, image] of images.entries()) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = `${randomName}-${(image.fileName || "default").toLowerCase().replace(/_/g, "-")}`

                    const { data: uploadData, error: uploadError } = await supabase.storage.from("boats-images").upload(`thumbnails/${fileName}`, decode(image.base64), {
                         contentType: image.mimeType,
                    })

                    if (uploadError) throw new Error(`Error uploading image: ${uploadError.message}`)

                    const publicUrl = supabase.storage.from("boats-images").getPublicUrl(uploadData.path).data.publicUrl

                    await supabase.from("boat_images").insert({
                         boat_id: boatId,
                         url: publicUrl,
                         caption: image.caption,
                         content_type: image.contentType,
                         dimensions: image.dimensions,
                         size: image.size,
                         mime_type: image.mimeType,
                         file_name: fileName,
                         is_default: index === 0,
                    })
               }
          } catch (error) {
               throw new Error(`Error in uploadImages: ${(error as Error).message}`)
          }
     }
}

export default new BoatRepositorySupabase()
