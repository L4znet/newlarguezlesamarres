import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export default class OfferEntity {
     constructor(
          public readonly profileId: string,
          public readonly boatId: string,
          public readonly title: string,
          public readonly description: string,
          public readonly price: number,
          public readonly isAvailable: boolean,
          public readonly frequency: number,
          public readonly equipments: Equipment[] | [],
          public readonly isSkipperAvailable: boolean,
          public readonly isTeamAvailable: boolean,
          public readonly rentalPeriod: RentalPeriod,
          public readonly location: Location,
          public readonly deletedAt: Date | null,
          public readonly id: string,
          public readonly boats: BoatEntity,
          public readonly profiles: ProfileEntity
     ) {}

     static fromSupabaseData(data: any): OfferEntity {
          return new OfferEntity(
               data.profile_id,
               data.boat_id,
               data.title,
               data.description,
               data.price,
               data.is_available,
               data.frequency,
               data.equipments
                    ? data.equipments.map((equip: any) => ({
                           name: equip.name,
                           quantity: equip.quantity,
                      }))
                    : [],
               data.is_skipper_available,
               data.is_team_available,
               data.rental_period,
               data.location
                    ? {
                           city: data.location.city,
                           country: data.location.country,
                           zipcode: data.location.zipcode,
                           address: data.location.address,
                      }
                    : {
                           city: "",
                           country: "",
                           zipcode: "",
                           address: "",
                      },
               data.deleted_at,
               data.id,
               BoatEntity.fromSupabaseData(data.boats),
               ProfileEntity.fromSupabaseUser(data.profiles)
          )
     }
}
