import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const getBoatsUseCase = async () => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boats = await BoatRepositorySupabase.getBoats(profileId)

          return boats as unknown as Boat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
