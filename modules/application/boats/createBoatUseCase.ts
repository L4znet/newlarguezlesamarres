import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"

export const createBoatUseCase = async (
     boatName: string,
     boatDescription: string,
     boatCapacity: string,
     boatType: number,
     boatImages: [
          {
               uri: string
               caption: string
          },
     ]
) => {
     try {
          const uploadedImageUrls = []

          const newBoat = await BoatRepositorySupabase.createBoat(boatName, boatDescription, boatCapacity, boatType, boatImages)

          return newBoat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
