export class CreateBoatDTO {
     public readonly profileId: string
     public readonly boatName: string
     public readonly boatDescription: string
     public readonly boatCapacity: string
     public readonly boatType: number

     constructor({ profile_id, boat_name, boat_description, boat_capacity, boat_type }: { profile_id: string; boat_name: string; boat_description: string; boat_capacity: string; boat_type: number }) {
          this.profileId = profile_id
          this.boatName = boat_name
          this.boatDescription = boat_description
          this.boatCapacity = boat_capacity
          this.boatType = boat_type
     }

     static fromRawData(data: { profile_id: string; boat_name: string; boat_description: string; boat_capacity: string; boat_type: number }): CreateBoatDTO {
          return new CreateBoatDTO(data)
     }

     static toRawData(dto: CreateBoatDTO): any {
          return {
               profile_id: dto.profileId,
               boat_name: dto.boatName,
               boat_description: dto.boatDescription,
               boat_capacity: dto.boatCapacity,
               boat_type: dto.boatType,
          }
     }
}
