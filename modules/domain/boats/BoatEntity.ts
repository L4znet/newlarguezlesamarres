export default class BoatEntity {
     constructor(
          public readonly id: string,
          public readonly profileId: string,
          public readonly boatName: string,
          public readonly boatDescription: string,
          public readonly boatCapacity: string,
          public readonly boatType: number
     ) {}

     static canCreateOffer(boatCount: number): boolean {
          return boatCount > 0
     }
}
