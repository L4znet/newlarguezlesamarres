import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"

export const updateBoatUseCase = async (
     boatId: string | string[],
     boat: {
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: string[]
     },
     boatDescription: boolean
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const { boatName, boatDescription, boatCapacity, boatType, boatImages } = boat

          const updatedBoat = await BoatRepositorySupabase.updateBoat(profileId, boatName, boatDescription, boatCapacity, boatType, boatId)
          if (!updatedBoat?.boatId) {
               throw new Error("Failed to update boat.")
          }

          if (boatDescription) {
               await BoatRepositorySupabase.uploadUpdateImages(updatedBoat.boatId, boatImages)
          }

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
