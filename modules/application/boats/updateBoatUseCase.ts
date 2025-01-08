import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { MessageType } from "react-native-flash-message"
import { router } from "expo-router"

export const updateBoatUseCase = async (
     boatId: string,
     updatedData: {
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: any[]
     },
     imageSelected: boolean,
     showTranslatedFlashMessage: (type: MessageType, message: { title: string; description: string }) => void
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const updatedBoat = await BoatRepositorySupabase.updateBoat(profileId, updatedData.boatName, updatedData.boatDescription, updatedData.boatCapacity, updatedData.boatType, boatId)

          if (!updatedBoat?.id) {
               throw new Error("Failed to update boat.")
          }

          if (imageSelected) {
               await BoatRepositorySupabase.uploadUpdateImages(updatedBoat.id, updatedData.boatImages)
          }

          showTranslatedFlashMessage("success", {
               title: "flash_title_success",
               description: "Boat updated successfully",
          })

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
