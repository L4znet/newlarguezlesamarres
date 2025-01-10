export class CreateBoatDTO {
     public readonly profileId: string
     public readonly boatName: string
     public readonly boatDescription: string
     public readonly boatCapacity: string
     public readonly boatType: number

     constructor(profileId: string, boatName: string, boatDescription: string, boatCapacity: string, boatType: number) {
          if (!profileId || !boatName || !boatCapacity || !boatType) {
               throw new Error("Missing required fields for CreateBoatDTO.")
          }

          this.profileId = profileId
          this.boatName = boatName
          this.boatDescription = boatDescription
          this.boatCapacity = boatCapacity
          this.boatType = boatType
     }

     static fromRequest(data: any): CreateBoatDTO {
          return new CreateBoatDTO(data.profile_id, data.boat_name, data.boat_description, data.boat_capacity, data.boat_type)
     }

     toEntity(): any {
          return {
               profileId: this.profileId,
               boatName: this.boatName,
               boatDescription: this.boatDescription,
               boatCapacity: this.boatCapacity,
               boatType: this.boatType,
          }
     }
}
