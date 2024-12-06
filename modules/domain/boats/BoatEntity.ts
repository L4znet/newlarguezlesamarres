export default class BoatEntity {
     constructor(
          public boat: {
               boatName: string
               boatDescription: string
               boatCapacity: string
               boatType: number
               boatImages: {
                    uri: string
                    caption: string
               }
          }
     ) {}

     static fromSupabaseUser(boat: {
          boat_name: string
          boat_description: string
          boat_capacity: string
          boat_type: number
          boat_images: {
               uri: string
               caption: string
          }
     }): BoatEntity {
          return new BoatEntity(boat)
     }
}
