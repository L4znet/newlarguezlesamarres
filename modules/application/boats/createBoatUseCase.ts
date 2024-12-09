import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"

export const createBoatUseCase = async (boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatImages: { uri: string; caption: string }[]) => {
     try {
          const uploadedImageUrls = []

          const newBoat = await BoatRepositorySupabase.createBoat(boatName, boatDescription, boatCapacity, boatType)

          console.log(newBoat)

          // await BoatRepositorySupabase.uploadAndInsertImages(boatId, images)

          return newBoat as Boat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
