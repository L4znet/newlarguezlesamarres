import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export default class OfferEntity {
     constructor(
          public readonly profileId: string,
          public readonly boatId: string,
          public readonly title: string,
          public readonly description: string,
          public readonly price: string,
          public readonly isAvailable: boolean,
          public readonly equipments: Equipment[] | [],
          public readonly isSkipperAvailable: boolean,
          public readonly isTeamAvailable: boolean,
          public readonly rentalPeriod: RentalPeriod,
          public readonly location: Location,
          public readonly deletedAt: Date | null,
          public readonly id?: string,
          public readonly boats?: BoatEntity,
          public readonly profiles?: ProfileEntity
     ) {}
}
