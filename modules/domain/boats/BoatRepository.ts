import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface BoatRepository {
     uploadImages(
          boatId: string | undefined,
          images: {
               fileName: any
               isDefault: any
               size: any
               base64: any
               caption: any
               mimeType: any
               contentType: any
               url: any
               dimensions: any
          }[]
     ): Promise<void>
     createBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId?: string): Promise<BoatEntity | undefined>
     updateBoat(profile_id: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatEntity | undefined>

     getSingleBoat(boatId: string | string[]): Promise<BoatEntity>
     getBoats(profile_id: string | undefined): Promise<BoatEntity[] | undefined>

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
}

export default BoatRepository
