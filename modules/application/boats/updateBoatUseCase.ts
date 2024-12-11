import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"

export const updateBoatUseCase = async (
     boatId: string,
     boatName: string,
     boatDescription: string,
     boatCapacity: string,
     boatType: number,
     boatImages: any[],
     setLoader: (value: boolean) => void,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     setLoader(true)
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const updatedBoat = await BoatRepositorySupabase.updateBoat(profileId, boatName, boatDescription, boatCapacity, boatType, boatId)
          if (!updatedBoat?.boatId) {
               throw new Error("Failed to update boat.")
          }

          await BoatRepositorySupabase.uploadImages(updatedBoat.boatId, boatImages)

          showTranslatedFlashMessage("success", {
               title: "flash_title_success",
               description: "Boat updated successfully!",
          })

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: (error as Error).message,
          })
     } finally {
          setLoader(false)
     }
}
