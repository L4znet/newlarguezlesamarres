import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const getSingleBoatUseCase = async (boatID: string | string[]) => {
     try {
          const session = await getCurrentSessionUseCase()

          const newBoat = await BoatRepositorySupabase.getSingleBoat(boatID)

          return newBoat as Boat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
