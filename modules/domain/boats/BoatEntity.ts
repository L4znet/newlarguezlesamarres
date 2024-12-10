export default class BoatEntity {
     constructor(
          public readonly profile_id: string,
          public readonly boatName: string,
          public readonly boatDescription: string,
          public readonly boatCapacity: string,
          public readonly boatType: number,
          public readonly boatId?: string,
          public readonly boatImages?: Boat["boatImages"]
     ) {}

     static fromSupabaseData(data: { profile_id: string; boat_name: string; boat_description: string; boat_capacity: string; boat_type: number; id?: string; boat_images: Boat["boatImages"] }): BoatEntity {
          return new BoatEntity(data.profile_id, data.boat_name, data.boat_description, data.boat_capacity, data.boat_type, data.id, data.boat_images)
     }

     toSupabaseData(): {
          profile_id: string
          boat_name: string
          boat_description: string
          boat_capacity: string
          boat_type: number
     } {
          return {
               profile_id: this.profile_id,
               boat_name: this.boatName,
               boat_description: this.boatDescription,
               boat_capacity: this.boatCapacity,
               boat_type: this.boatType,
          }
     }
}
