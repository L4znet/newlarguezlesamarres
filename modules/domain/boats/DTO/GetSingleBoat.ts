import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { BoatImageDTO } from "@/modules/domain/boats/DTO/BoatImageDTO"

export type BoatImageRawData = {
     id: string
     url: string
     boat_id: string
     is_default: boolean
     caption: string
     content_type: string
     base64: string
     dimensions: { width: number; height: number }
     size: string
     mime_type: string
     file_name: string
}

export type BoatRawData = {
     id: string
     profile_id: string
     boat_name: string
     boat_description: string
     boat_capacity: string
     boat_type: number
     boat_images: BoatImageRawData[]
}

export class GetSingleBoatDTO {
     public id: string
     public profileId: string
     public boatName: string
     public boatDescription: string
     public boatCapacity: string
     public boatType: number
     public boatImages: BoatImageDTO[]

     constructor(data: BoatRawData) {
          this.id = data.id
          this.profileId = data.profile_id
          this.boatName = data.boat_name
          this.boatDescription = data.boat_description
          this.boatCapacity = data.boat_capacity
          this.boatType = data.boat_type

          this.boatImages = data.boat_images.map((image) => BoatImageDTO.fromRawData(image))
     }

     static fromRawData(data: BoatRawData): GetSingleBoatDTO {
          return new GetSingleBoatDTO(data)
     }

     static toRawData(data: GetSingleBoatDTO): BoatRawData {
          return {
               id: data.id,
               profile_id: data.profileId,
               boat_name: data.boatName,
               boat_description: data.boatDescription,
               boat_capacity: data.boatCapacity,
               boat_type: data.boatType,
               boat_images: data.boatImages.map((image) => BoatImageDTO.toRawData(image)), // Mapper les images vers leurs données brutes
          }
     }
}
