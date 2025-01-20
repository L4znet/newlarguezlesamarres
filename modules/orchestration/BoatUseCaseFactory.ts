import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import { updateBoatUseCase } from "@/modules/application/boats/updateBoatUseCase"
import { getCountBoatsUseCase } from "@/modules/application/boats/getCountBoatsUseCase"
import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"

export const makeCreateBoatUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()
     return (params: { boatName: string; boatDescription: string; boatCapacity: string; boatType: number; boatImages: any[] }) => createBoatUseCase(boatRepository, params)
}

export const makeGetBoatsUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()
     return () => getBoatsUseCase(boatRepository)
}
export const makeDeleteBoatUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()
     return (boatId: string) => deleteBoatUseCase(boatRepository, boatId)
}

export const makeUpdateBoatUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()
     return (boatId: string, updatedData: any, imageSelected: boolean) => {
          return updateBoatUseCase(boatId, boatRepository, updatedData, imageSelected)
     }
}

export const makeGetCountBoatsUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()

     return () => getCountBoatsUseCase(boatRepository)
}

export const makeGetSingleBoatUseCase = () => {
     const boatRepository = new BoatRepositorySupabase()

     return (boatId: string) => getSingleBoatUseCase(boatRepository, boatId)
}
