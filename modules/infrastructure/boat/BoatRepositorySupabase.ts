import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"

class BoatRepositorySupabase implements BoatRepository {
     async updateBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined> {
          try {
               const boatIdString = Array.isArray(boatId) ? boatId[0] : boatId

               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .update({
                         profile_id,
                         boat_name: boatName,
                         boat_type: boatType,
                         boat_description: boatDescription,
                         boat_capacity: boatCapacity,
                    })
                    .eq("id", boatIdString)
                    .select()

               if (boatError) {
                    console.error("boatError:", boatError)
                    throw new Error(`Error updating boat: ${boatError.message}`)
               }

               if (boatData) {
                    return BoatEntity.fromSupabaseData(boatData[0])
               }

               throw new Error("No data returned from boat update.")
          } catch (error) {
               console.error("Error in BoatRepositorySupabase.updateBoat:", error)
               throw new Error((error as Error).message)
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
                    console.error("boatError", boatError)
                    throw new Error(`Error getting boat: ${boatError.message}`)
               }

               if (boatData) {
                    return BoatEntity.fromSupabaseData(boatData)
               }

               throw new Error("No data returned from boat query.")
          } catch (error) {
               console.error("Error in BoatRepositorySupabase.getSingleBoat:", error)
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
                    console.error("boatError", boatError)
                    throw new Error(`Error getting boats: ${boatError.message}`)
               }

               if (boatData) {
                    return boatData.map((boat: any) => BoatEntity.fromSupabaseData(boat))
               }
          } catch (error) {
               console.error("Error in BoatRepositorySupabase.getBoats:", error)
               throw new Error((error as Error).message)
          }
     }

     async createBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity | undefined> {
          try {
               const { data: boatData, error: boatError } = await supabase
                    .from("boats")
                    .insert({
                         profile_id,
                         boat_name: boatName,
                         boat_type: boatType,
                         boat_description: boatDescription,
                         boat_capacity: boatCapacity,
                    })
                    .select()

               if (boatError) {
                    console.error("boatError", boatError)
                    throw new Error(`Error adding boat: ${boatError.message}`)
               }

               if (boatData) {
                    return BoatEntity.fromSupabaseData(boatData[0])
               }

               throw new Error("No data returned from boat creation.")
          } catch (error) {
               console.error("Error in BoatRepositorySupabase.createBoat:", error)
               throw new Error((error as Error).message)
          }
     }

     async uploadImages(
          boatId: string | undefined,
          images: {
               uri: string
               caption: string | undefined | null
               contentType: string | undefined
               base64: string | undefined | null
               dimensions: { width: number; height: number }
               size: number | undefined
               mimeType: string | undefined
               fileName: string | undefined | null
          }[]
     ): Promise<void> {
          try {
               for (const image of images) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = `${randomName}-${(image.fileName || "").toLowerCase().replace(/_/g, "-")}`

                    if (image.base64 != null) {
                         const { data: uploadData, error: uploadError } = await supabase.storage.from("boats-images").upload(`thumbnails/${fileName}`, decode(image.base64), {
                              contentType: image.mimeType,
                              upsert: true,
                         })

                         if (uploadError) {
                              console.error("Upload error:", uploadError)
                              throw new Error(`Error uploading image: ${uploadError.message}`)
                         }

                         if (uploadData) {
                              const publicUrl = await this.getPublicUrl(uploadData)

                              if (publicUrl) {
                                   await this.insertImage(boatId, image, publicUrl)
                              }
                         }
                    }
               }
          } catch (error) {
               console.error("Error in uploadImage:", error)
               throw new Error((error as Error).message)
          }
     }

     async getPublicUrl(image: any): Promise<string | undefined> {
          try {
               const publicUrl = supabase.storage.from("boats-images").getPublicUrl(image.path).data.publicUrl

               if (!publicUrl) {
                    throw new Error("Error getting public URL for uploaded image.")
               }

               if (publicUrl) {
                    return publicUrl
               }
          } catch (error) {
               console.error("Error in uploadAndUpsertImages:", error)
               throw new Error((error as Error).message)
          }
     }

     async insertImage(boatId: string | undefined, image: any, publicUrl: string | undefined): Promise<void> {
          try {
               const { data: imageData, error: imageError } = await supabase.from("boat_images").insert([
                    {
                         boat_id: boatId,
                         url: publicUrl,
                         caption: image.caption,
                         content_type: image.contentType,
                         base64: image.base64,
                         dimensions: image.dimensions,
                         size: image.size,
                         mime_type: image.mimeType,
                         file_name: image.fileName,
                         is_default: image.isDefault,
                    },
               ])

               if (imageError) {
                    console.error("imageError:", imageError)
                    throw new Error(`Error inserting image: ${imageError.message}`)
               }

               if (imageData) {
                    console.log("IMAGE INSÉRÉE AVEC SUCCÈS")
               }
          } catch (error) {
               console.error("Error in uploadAndUpsertImages:", error)
               throw new Error((error as Error).message)
          }
     }
}

export default new BoatRepositorySupabase()
