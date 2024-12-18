export default class OfferEntity {
     constructor(
          public readonly profileId: string,
          public readonly title: string,
          public readonly description: string,
          public readonly price: number,
          public readonly is_available: boolean,
          public readonly frequency: number,
          public readonly equipments: [{ name: string; quantity: number }],
          public readonly is_skipper_available: boolean,
          public readonly is_team_available: boolean,
          public readonly rental_period: { start: Date; end: Date },
          public readonly location: { city: string; country: string; zip_code: string; address: string },
          public readonly deleted_at: { country: any; address: any; city: any; zip_code: any },
          public readonly offerId?: string | undefined
     ) {}

     static fromSupabaseData(data: any): OfferEntity {
          return new OfferEntity(
               data.offer_id,
               data.profile_id,
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
                           zip_code: data.location.zip_code,
                           address: data.location.address,
                      }
                    : {
                           city: "",
                           country: "",
                           zip_code: "",
                           address: "",
                      },
               data.deleted_at
          )
     }
}
