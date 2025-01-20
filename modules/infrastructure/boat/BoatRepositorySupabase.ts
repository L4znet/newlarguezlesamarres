import { BoatRepository } from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import supabase from "@/supabaseClient"
import { decode } from "base64-arraybuffer"
import { CreateBoatDTO } from "@/modules/domain/boats/DTO/CreateBoatDTO"
import { UploadBoatImageDTO } from "@/modules/domain/boats/DTO/UploadBoatImageDTO"
import { BoatRawData, GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"
import { GetSingleBoatDTO } from "@/modules/domain/boats/DTO/GetSingleBoatDTO"
import { UpdateBoatDTO } from "@/modules/domain/boats/DTO/UpdateBoatDTO"
import { BoatIdResponseDTO } from "@/modules/domain/boats/DTO/BoatIdResponseDTO"

export default class BoatRepositorySupabase implements BoatRepository {
     async createBoat(profileId: string, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatIdResponseDTO> {
          const createBoatDTO = new CreateBoatDTO({
               profile_id: profileId,
               boat_name: boatName,
               boat_description: boatDescription,
               boat_capacity: boatCapacity,
               boat_type: boatType,
          })

          const {
               data: boatCreated,
               error: boatError,
          }: {
               data: { id: string } | null
               error: Error | null
          } = await supabase.from("boats").insert(CreateBoatDTO.toRawData(createBoatDTO)).select("id").single()

          if (boatError) {
               throw new Error(`Error creating boat: ${boatError.message}`)
          }

          if (!boatError && boatCreated) {
               return new BoatIdResponseDTO(boatCreated.id)
          }

          throw new Error("No data returned from boat creation.")
     }

     async updateBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string): Promise<BoatIdResponseDTO | undefined> {
          try {
               const updateData = new UpdateBoatDTO({
                    boatId,
                    boatName,
                    boatDescription,
                    boatCapacity,
                    boatType,
               })
               const rawData = UpdateBoatDTO.toRawData(updateData)
               const { data: boatUpdated, error: boatError } = await supabase.from("boats").update(rawData).eq("id", boatId).select("id").single()

               if (boatError) {
                    throw new Error(`Error updating boat: ${boatError.message}`)
               }

               if (boatUpdated) {
                    return new BoatIdResponseDTO(boatUpdated.id)
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }

     async uploadImages(boatId: string, images: any[]): Promise<void> {
          const imagesToInsert = []

          try {
               for (const [index, image] of images.entries()) {
                    const randomName = Math.random().toString(36).substring(7)
                    const fileName = `${randomName}-${(image.fileName || "default").toLowerCase().replace(/_/g, "-")}`

                    const { data: uploadData, error: uploadError } = await supabase.storage.from("boats-images").upload(`thumbnails/${fileName}`, decode(image.base64), {
                         contentType: image.mimeType,
                    })

                    if (!uploadError && uploadData) {
                         const publicUrl = supabase.storage.from("boats-images").getPublicUrl(uploadData.path).data.publicUrl

                         imagesToInsert.push({
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
                    }

                    if (uploadError) {
                         throw new Error(`Error uploading image: ${uploadError.message}`)
                    }
               }
               if (imagesToInsert.length === images.length) {
                    for (const imageToInsert of imagesToInsert) {
                         const uploadBoatImageDTO = new UploadBoatImageDTO({
                              url: imageToInsert.url,
                              is_default: imageToInsert.is_default,
                              caption: imageToInsert.caption,
                              content_type: imageToInsert.content_type,
                              base64: imageToInsert.base64,
                              dimensions: imageToInsert.dimensions,
                              size: imageToInsert.size,
                              mime_type: imageToInsert.mime_type,
                              file_name: imageToInsert.file_name,
                              boat_id: boatId,
                         })
                         const { data: boatImagesInsert, error } = await supabase.from("boat_images").insert(UploadBoatImageDTO.toRawData(uploadBoatImageDTO)).select("id")
                         if (error) {
                              throw new Error(`Error inserting image: ${error.message}`)
                         }
                    }
               }
          } catch (error) {
               throw new Error((error as Error).message)
          }
     }
     async uploadUpdateImages(boatId: string, newImages: any[]): Promise<void> {
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

                    const uploadBoatImageDTO = new UploadBoatImageDTO({
                         url: publicUrl,
                         is_default: image.isDefault,
                         caption: image.caption,
                         content_type: image.contentType,
                         base64: image.base64,
                         dimensions: image.dimensions,
                         size: image.size,
                         mime_type: image.mimeType,
                         file_name: fileName,
                         boat_id: boatId,
                    })

                    const { data, error } = await supabase.from("boat_images").insert(UploadBoatImageDTO.toRawData(uploadBoatImageDTO)).select("id")

                    if (error) {
                         throw new Error(`Error inserting image: ${error.message}`)
                    }
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
          console.log("profileId", profileId)

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
                    return boatData.map((boat: BoatRawData) => {
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
                    throw new Error(`Error getting boats: ${error.message}`)
               }

               return count
          } catch (error) {
               throw new Error(`Error in getBoats: ${(error as Error).message}`)
          }
     }
}
