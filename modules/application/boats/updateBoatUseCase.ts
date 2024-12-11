import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const updateBoatUseCase = async (
     boatId: string | string[],
     boatName: string,
     boatDescription: string,
     boatCapacity: string,
     boatType: number,
     boatImages: {
          url: string
          caption: string | undefined | null
          contentType: string | undefined
          base64: string | undefined | null
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined | null
          isDefault: boolean
     }[]
) => {
     const normalizeImages = (images: any[]) => {
          return images.map((image) => {
               return {
                    url: image.uri,
                    caption: image.caption,
                    contentType: image.contentType,
                    base64: image.base64,
                    dimensions: image.dimensions,
                    size: image.size,
                    mimeType: image.mimeType,
                    fileName: image.fileName,
                    isDefault: image.isDefault,
               }
          })
     }

     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const newBoat = await BoatRepositorySupabase.updateBoat(profileId, boatName, boatDescription, boatCapacity, boatType, boatId)

          if (newBoat?.boatId && boatImages.length > 0) {
               const normalizedImages = normalizeImages(boatImages)

               console.log("normalizedImages", normalizedImages)

               await BoatRepositorySupabase.uploadImages(newBoat?.boatId, normalizedImages)
          }

          return newBoat as Boat
     } catch (error) {
          console.error("Error in updateBoatUseCase:", error)
          throw new Error((error as Error).message)
     }
}
