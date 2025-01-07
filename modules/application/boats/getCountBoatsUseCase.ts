import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { MessageType } from "react-native-flash-message"

export const getCountBoatsUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<Number | null> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boatCount = await BoatRepositorySupabase.getBoatsCount(profileId)

          return boatCount as Number | null
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
