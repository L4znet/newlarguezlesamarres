import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { MessageType } from "react-native-flash-message"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

export const createBoatUseCase = async (
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
     ) => BoatEntity
) => {
     setLoader(true)
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const newBoat = await BoatRepositorySupabase.createBoat(profileId, boatName, boatDescription, boatCapacity, boatType)
          if (!newBoat?.boatId) {
               throw new Error("Failed to create boat.")
          }

          await BoatRepositorySupabase.uploadImages(newBoat.boatId, boatImages)

          showTranslatedFlashMessage("success", {
               title: "flash_title_success",
               description: "Boat added successfully!",
          })
          router.push("/(app)/(tabs)/(boats)")
          return newBoat
     } catch (error) {
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: (error as Error).message,
          })
     } finally {
          setLoader(false)
     }
}
