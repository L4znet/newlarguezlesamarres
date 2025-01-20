import { BoatRepository } from "@/modules/domain/boats/BoatRepository"

export const getSingleBoatUseCase = async (boatRepository: BoatRepository, boatId: string) => {
     try {
          return await boatRepository.getSingleBoat(boatId)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
