import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     createBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity>
}

export default BoatRepository
