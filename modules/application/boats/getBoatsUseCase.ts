import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { MessageType } from "react-native-flash-message"

export const getBoatsUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<BoatEntity[]> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boats = await BoatRepositorySupabase.getBoats(profileId)

          if (!boats) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "An error occurred while loading the boats." })
          }

          return boats as BoatEntity[] | []
     } catch (error) {
          console.log("error", error)
          throw new Error((error as Error).message)
     }
}
