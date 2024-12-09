export default class BoatEntity {
     constructor(
          public readonly boatName: string,
          public readonly boatDescription: string,
          public readonly boatCapacity: string,
          public readonly boatType: number,
          public readonly boatImages: { uri: string; caption: string }[]
     ) {}

     static fromSupabaseUser(obj: { boatName: string; boatDescription: string; boatCapacity: string; boatType: number; boatImages: { uri: string; caption: string }[] }): BoatEntity {
          return new BoatEntity(obj.boatName, obj.boatDescription, obj.boatCapacity, obj.boatType, obj.boatImages)
     }
}
