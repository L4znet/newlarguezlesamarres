import { createClient } from "@supabase/supabase-js"
import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import boatRepository from "@/modules/domain/boats/BoatRepository"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number, images: [{ uri: string; caption: string }]): Promise<BoatEntity> {
          const currentUser = await getCurrentUserUseCase()

          console.log({
               profile_id: currentUser?.user.user.id,
               boat_name: boatName,
               boat_type: boatType,
               boat_description: boatDescription,
               boat_capacity: boatCapacity,
          })

          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .insert({
                         profile_id: currentUser?.user.user.id,
                         boat_name: boatName,
                         boat_type: boatType,
                         boat_description: boatDescription,
                         boat_capacity: boatCapacity,
                    })
                    .select()

               console.log("boatData", boatData)
               console.log("boatData", boatError)

               if (boatError) {
                    throw new Error(`Error adding boat: ${boatError.message}`)
               }

               const boatId = boatData[0].id

               console.log(images)

               const uploadedImages = await this.uploadAndInsertImages(boatId, images)

               return { ...boatData[0], images: uploadedImages }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async updateBoat(boatId: string, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, images: [{ uri: string; caption: string }]): Promise<BoatEntity> {
          try {
               const { data: updatedBoatData, error: updateError } = await supabase
                    .from("boats")
                    .update({
                         boatName,
                         boatDescription,
                         boatCapacity,
                         boatType,
                    })
                    .eq("id", boatId)
                    .select()

               if (updateError) {
                    throw new Error((updateError as Error).message)
               }

               let uploadedImages: { url: string; is_default: boolean }[] = []
               if (images && images.length > 0) {
                    uploadedImages = await this.uploadAndInsertImages(boatId, images)
               }

               return { ...updatedBoatData[0], images: uploadedImages }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async getBoats() {
          try {
               const { data: boatsData, error } = await supabase.from("boats").select("*")

               if (error) {
                    throw new Error(`Error fetching boats: ${error.message}`)
               }

               const boats = []
               for (const boatData of boatsData) {
                    // Get related images from boat_images table
                    const { data: imagesData, error: imagesError } = await supabase.from("boat_images").select("*").eq("boat_id", boatData.id)
                    if (imagesError) {
                         throw new Error(`Error fetching boat images: ${imagesError.message}`)
                    }

                    boats.push(new BoatEntity({ ...boatData, images: imagesData }))
               }
               return boats
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async getBoatById(boatId: string) {
          try {
               const { data, error } = await supabase.from("boats").select("*").eq("id", boatId).single()
               if (error) {
                    throw new Error(`Error fetching boat: ${error.message}`)
               }

               const { data: imagesData, error: imagesError } = await supabase.from("boat_images").select("*").eq("boat_id", boatId)
               if (imagesError) {
                    throw new Error(`Error fetching boat images: ${imagesError.message}`)
               }

               return new BoatEntity({ ...data, images: imagesData })
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

     async deleteImages(images: [{ id: string; url: string }]) {
          try {
               for (const image of images) {
                    const path = new URL(image.url).pathname.split("/").slice(2).join("/")
                    const { error } = await supabase.storage.from("boats-images").remove([path])
                    if (error) {
                         throw new Error(`Error deleting image: ${error.message}`)
                    }
               }

               // Delete image records from boat_images table
               const imageIds = images.map((image) => image.id)
               const { error: deleteError } = await supabase.from("boat_images").delete().in("id", imageIds)
               if (deleteError) {
                    throw new Error(`Error deleting boat images: ${deleteError.message}`)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }
}

export default new BoatRepositorySupabase()
