import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     createBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId?: string): Promise<BoatEntity | undefined>
     updateBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined>
     getSingleBoat(boatId: string | string[]): Promise<BoatEntity | undefined>
     getBoats(): Promise<BoatEntity[]>
     deleteBoat(boatId: string): Promise<void>
}

export default BoatRepository
