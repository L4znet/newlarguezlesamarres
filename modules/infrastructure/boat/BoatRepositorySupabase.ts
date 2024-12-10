import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity> {
          const session = await getCurrentSessionUseCase()

          console.warn({
               profile_id: session.data.session?.user.id,
               boat_name: boatName,
               boat_type: boatType,
               boat_description: boatDescription,
               boat_capacity: boatCapacity,
          })

          try {
               const { data: boatData, error: boatError } = await supabase.from("boats").insert({
                    profile_id: session.data.session?.user.id,
                    boat_name: boatName,
                    boat_type: boatType.toString(),
                    boat_description: boatDescription,
                    boat_capacity: boatCapacity,
               })

               if (boatError) {
                    throw new Error(`Error adding boat: ${boatError.message}`)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async uploadAndInsertImages(boatId: string, images: [{ uri: string }]) {
          try {
               const uploadedImages = []
               const randomName = Math.random().toString(36).substring(7)
               for (const [index, image] of images.entries()) {
                    const { data, error } = await supabase.storage.from("boats-images").upload(`${randomName}-${index}.jpg`, image.uri)

                    if (error) {
                         throw new Error(`Error uploading image: ${error.message}`)
                    }

                    // Get the public URL of the uploaded image
                    const publicUrl = supabase.storage.from("boats-images").getPublicUrl(data.path).data.publicUrl

                    // Insert image record into boat_images table
                    const { error: insertError } = await supabase.from("boat_images").insert({
                         boat_id: boatId,
                         url: publicUrl,
                         is_default: index === 0,
                    })

                    if (insertError) {
                         throw new Error(`Error inserting boat image: ${insertError.message}`)
                    }

                    uploadedImages.push({ url: publicUrl, is_default: index === 0 })
               }
               return uploadedImages
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }
}

export default new BoatRepositorySupabase()
