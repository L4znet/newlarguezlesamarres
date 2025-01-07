import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     createBoat(profileId: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatEntity | undefined>
     updateBoat(profileId: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined>

     getSingleBoat(boatId: string | string[]): Promise<BoatEntity>

     uploadImages(
          boatId: string | undefined,
          images: {
               url: string
               caption: string | undefined | null
               contentType: string | undefined
               base64: string | undefined | null
               dimensions: { width: number; height: number }
               size: number | undefined
               mimeType: string | undefined
               fileName: string | undefined | null
               isDefault: boolean
          }[]
     ): Promise<void>
     deleteBoat(profileId: string | undefined, boatId: string | string[]): Promise<BoatEntity | undefined>
     getSingleBoat(boatId: string | string[]): Promise<BoatEntity>
     getBoats(profileId: string | undefined): Promise<BoatEntity[] | undefined>
     getBoatsCount(profileId: string | undefined): Promise<Number | null>
     deleteBoat(profileId: string | undefined, boatId: string | string[]): Promise<BoatEntity | undefined>
}

export default BoatRepository
