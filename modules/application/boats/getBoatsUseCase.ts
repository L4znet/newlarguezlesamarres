import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

export const getBoatsUseCase = async (): Promise<BoatEntity[]> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boats = await BoatRepositorySupabase.getBoats(profileId)

          return boats as BoatEntity[]
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
