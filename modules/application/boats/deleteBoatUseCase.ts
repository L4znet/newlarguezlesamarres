import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { MessageType } from "react-native-flash-message"

export const deleteBoatUseCase = async (
     boatId: string,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const deletedBoat = await BoatRepositorySupabase.deleteBoat(profileId, boatId)
          if (!deletedBoat?.id) {
               throw new Error("Failed to delete boat.")
          }

          showTranslatedFlashMessage("success", {
               title: "flash_title_success",
               description: "Boat deleted successfully",
          })

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
