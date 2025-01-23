export class UpdateBoatDTO {
     public boatName: string
     public boatDescription: string
     public boatCapacity: string
     public boatType: number
     public boatId: string
     public updatedAt: Date

     constructor(data: { boatId: string; boatName: string; boatDescription: string; boatCapacity: string; boatType: number; updatedAt: Date }) {
          this.boatId = data.boatId
          this.boatName = data.boatName
          this.boatDescription = data.boatDescription
          this.boatCapacity = data.boatCapacity
          this.boatType = data.boatType
          this.updatedAt = data.updatedAt
     }

     static toRawData(data: UpdateBoatDTO): any {
          return {
               boat_name: data.boatName,
               boat_description: data.boatDescription,
               boat_capacity: data.boatCapacity,
               boat_type: data.boatType,
               updated_at: data.updatedAt,
          }
     }
}
