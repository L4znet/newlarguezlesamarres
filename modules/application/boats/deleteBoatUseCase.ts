import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { BoatRepository } from "@/modules/domain/boats/BoatRepository"

export const deleteBoatUseCase = async (boatRepository: BoatRepository, boatId: string) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const deletedBoat = await boatRepository.deleteBoat(profileId, boatId)
          if (!deletedBoat?.id) {
               throw new Error("Failed to delete boat.")
          }

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
