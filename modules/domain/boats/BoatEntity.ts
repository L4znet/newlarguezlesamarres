export default class BoatEntity {
     constructor(
          public readonly id: string,
          public readonly profileId: string,
          public readonly boatName: string,
          public readonly boatDescription: string,
          public readonly boatCapacity: string,
          public readonly boatType: number
     ) {}

     static fromSupabaseData(data: any): BoatEntity {
          return new BoatEntity(data.id, data.profile_id, data.boat_name, data.boat_description, data.boat_capacity, data.boat_type)
     }

     static toSupabaseData(data: BoatEntity): any {
          return {
               id: data.id,
               profile_id: data.profileId,
               boat_name: data.boatName,
               boat_description: data.boatDescription,
               boat_capacity: data.boatCapacity,
               boat_type: data.boatType,
          }
     }
}
