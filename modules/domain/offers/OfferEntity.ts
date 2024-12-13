export default class OfferEntity {
     constructor(
          offerId: string,
          profileId: string,
          title: string,
          description: string,
          price: number,
          is_available: boolean,
          frequency: number,
          equipments: [
               {
                    id: string
                    name: string
                    description: string
               },
          ],
          is_skipper_available: boolean,
          is_team_available: boolean,
          rental_period: [
               {
                    from: Date
                    to: Date
               },
          ],
          location: {
               city: string
               country: string
               zip_code: string
               address: string
          },
          is_archived: boolean,
          deleted_at: Date
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
                           id: equip.id,
                           name: equip.name,
                           description: equip.description,
                      }))
                    : [],
               data.is_skipper_available,
               data.is_team_available,
               data.rental_period
                    ? data.rental_period.map((period: any) => ({
                           from: period.from,
                           to: period.to,
                      }))
                    : [],
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
               data.is_archived,
               data.deleted_at
          )
     }
}
