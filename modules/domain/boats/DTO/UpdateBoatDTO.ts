export class UpdateBoatDTO {
     public boatName: string
     public boatDescription: string
     public boatCapacity: string
     public boatType: number
     public boatId: string

     constructor(data: { boatId: string; boatName: string; boatDescription: string; boatCapacity: string; boatType: number }) {
          this.boatId = data.boatId
          this.boatName = data.boatName
          this.boatDescription = data.boatDescription
          this.boatCapacity = data.boatCapacity
          this.boatType = data.boatType
     }

     static fromRawData(data: { boatId: string; boatName: string; boatDescription: string; boatCapacity: string; boatType: number }): UpdateBoatDTO {
          return new UpdateBoatDTO(data)
     }

     static toRawData(data: UpdateBoatDTO): any {
          return {
               boat_name: data.boatName,
               boat_description: data.boatDescription,
               boat_capacity: data.boatCapacity,
               boat_type: data.boatType,
          }
     }
}
