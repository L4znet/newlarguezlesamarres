import { BoatRepository } from "@/modules/domain/boats/BoatRepository"
import { router } from "expo-router"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const createBoatUseCase = async (
     boatRepository: BoatRepository,
     {
          boatName,
          boatDescription,
          boatCapacity,
          boatType,
          boatImages,
     }: {
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: any[]
     }
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const newBoat = await boatRepository.createBoat(profileId, boatName, boatDescription, boatCapacity, boatType)

          if (!newBoat?.id) {
               throw new Error("Failed to create boat.")
          }

          await boatRepository.uploadImages(newBoat.id, boatImages)

          router.push("/(app)/(tabs)/(boats)")
          return newBoat
     } catch (error) {
          throw error
     }
}
