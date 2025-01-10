import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const getSingleBoatUseCase = async (boatID: string | string[]) => {
     try {
          return await BoatRepositorySupabase.getSingleBoat(boatID)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
