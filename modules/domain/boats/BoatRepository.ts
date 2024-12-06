import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     createBoat(
          boatName: string,
          boatDescription: string,
          boatCapacity: string,
          boatType: number,
          images: [
               {
                    uri: string
               },
          ]
     ): Promise<BoatEntity>
     updateBoat(
          boatId: string,
          boatName: string,
          boatDescription: string,
          boatCapacity: string,
          boatType: number,
          images: [
               {
                    uri: string
               },
          ]
     ): Promise<BoatEntity>
     getBoatById(boatId: string): Promise<BoatEntity>
     getBoats(): Promise<BoatEntity[]>
}

export default BoatRepository
