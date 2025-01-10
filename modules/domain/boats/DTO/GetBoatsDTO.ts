export type BoatImageRawData = {
     id: string
     url: string
     boat_id: string
     is_default: boolean
     caption: string
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

export class GetBoatsDTO {
     public id: string
     public profileId: string
     public boatName: string
     public boatDescription: string
     public boatCapacity: string
     public boatType: number
     public boatImages: BoatImageRawData[]

     constructor(data: BoatRawData) {
          this.id = data.id
          this.profileId = data.profile_id
          this.boatName = data.boat_name
          this.boatDescription = data.boat_description
          this.boatCapacity = data.boat_capacity
          this.boatType = data.boat_type
          this.boatImages = data.boat_images
     }

     static fromRawData(data: BoatRawData): GetBoatsDTO {
          return new GetBoatsDTO(data)
     }
}
