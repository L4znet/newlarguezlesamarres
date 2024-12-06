import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     createBoat(boat: BoatEntity): Promise<BoatEntity>
     updateBoat(boatId: string, boat: BoatEntity): Promise<BoatEntity>
     deleteBoat(boatId: string): Promise<void>
     getBoatById(boatId: string): Promise<BoatEntity>
     getBoats(): Promise<BoatEntity[]>
}

export default BoatRepository
