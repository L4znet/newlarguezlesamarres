import { GetSingleBoatDTO } from "@/modules/domain/boats/DTO/GetSingleBoatDTO"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"
import { BoatIdResponseDTO } from "@/modules/domain/boats/DTO/BoatIdResponseDTO"

export interface BoatRepository {
     createBoat(profileId: string | undefined, boatName: string, boatDescription: string, boatCapacity: string, boatType: number): Promise<BoatIdResponseDTO>
     updateBoat(boatName: string, boatDescription: string, boatCapacity: string, boatType: number, boatId: string | string[]): Promise<BoatIdResponseDTO | undefined>
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
     getSingleBoat(boatId: string | string[]): Promise<GetSingleBoatDTO>
     getBoats(profileId: string | undefined): Promise<GetBoatsDTO[] | undefined>
     getBoatsCount(profileId: string | undefined): Promise<Number | null>
     deleteBoat(profileId: string | undefined, boatId: string | string[]): Promise<BoatIdResponseDTO | undefined>
     uploadUpdateImages(boatId: string | undefined, images: any[]): Promise<void>
}
