import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { MessageType } from "react-native-flash-message"
import { BoatRepositorySupabase } from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { BoatRepository } from "@/modules/domain/boats/BoatRepository"

export const getCountBoatsUseCase = async (boatRepository: BoatRepository): Promise<Number | null> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boatCount = await boatRepository.getBoatsCount(profileId)

          return boatCount as Number | null
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
