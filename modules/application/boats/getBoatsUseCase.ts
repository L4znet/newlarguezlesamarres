import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { MessageType } from "react-native-flash-message"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"

export const getBoatsUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<GetBoatsDTO[] | undefined> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boats = await BoatRepositorySupabase.getBoats(profileId)

          console.log("boats", boats)

          console.log("-------------------------------")

          if (!boats) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "An error occurred while loading the boats." })
          }

          return boats
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
