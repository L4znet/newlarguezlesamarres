export default class BoatEntity {
     constructor(
          public boat: {
               boat: Boat
          }
     ) {}

     static fromSupabaseUser(boat: { boat: Boat }): BoatEntity {
          return new BoatEntity(boat)
     }
}
