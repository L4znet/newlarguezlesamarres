import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { MessageType } from "react-native-flash-message"

export const deleteBoatUseCase = async (boatId: string) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const deletedBoat = await BoatRepositorySupabase.deleteBoat(profileId, boatId)
          if (!deletedBoat?.boatId) {
               throw new Error("Failed to delete boat.")
          }

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
