import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { BoatRepository } from "@/modules/domain/boats/BoatRepository"

export const updateBoatUseCase = async (
     boatId: string,
     boatRepository: BoatRepository,
     updatedData: {
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: {
               id?: string | null
               url: string
               boatId?: string
               isDefault: boolean
               caption: string | null
               contentType: string
               base64: string
               dimensions: { width: number; height: number }
               size: string
               mimeType: string
               fileName: string | null
          }[]
     },
     imageSelected: boolean
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const updatedBoat = await boatRepository.updateBoat(updatedData.boatName, updatedData.boatDescription, updatedData.boatCapacity, updatedData.boatType, boatId)

          if (!updatedBoat?.id) {
               throw new Error("Failed to update boat.")
          }

          if (imageSelected) {
               await boatRepository.uploadUpdateImages(boatId, updatedData.boatImages)
          }

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
