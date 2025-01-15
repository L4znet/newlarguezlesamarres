import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"

export type BoatImageRawData = {
     id: string
     url: string
     boat_id: string
     is_default: boolean
     caption: string
}

export type OfferRawData = {
     id: string
     profile_id: string
     boat_id: string
     title: string
     description: string
     price: string
     is_available: boolean
     equipments: Equipment[] | []
     is_skipper_available: boolean
     is_team_available: boolean
     rental_period: RentalPeriod
     location: Location
     deleted_at: Date | null
     boats: {
          id: string
          boat_name: string
          boat_images: BoatImageRawData[]
     }
     profiles: {
          id: string
          firstname: string
          lastname: string
          username: string
     }
}

export class GetSingleOfferDTO {
     public readonly id: string
     public readonly profileId: string
     public readonly boatId: string
     public readonly title: string
     public readonly description: string
     public readonly price: string
     public readonly isAvailable: boolean
     public readonly equipments: Equipment[] | []
     public readonly isSkipperAvailable: boolean
     public readonly isTeamAvailable: boolean
     public readonly rentalPeriod: RentalPeriod
     public readonly location: Location
     public readonly deletedAt: Date | null
     public readonly boat: {
          id: string
          name: string
          images: {
               id: string
               url: string
               caption: string
          }[]
     }
     public readonly profile: {
          id: string
          firstname: string
          lastname: string
          username: string
     }

     constructor({ id, profile_id, boat_id, title, description, price, is_available, equipments, is_skipper_available, is_team_available, rental_period, location, deleted_at, boat, profiles }: { id: string; profile_id: string; boat_id: string; title: string; description: string; price: string; is_available: boolean; equipments: Equipment[] | []; is_skipper_available: boolean; is_team_available: boolean; rental_period: RentalPeriod; location: Location; deleted_at: Date | null; boat: { id: string; boat_name: string; boat_images: { id: string; url: string; caption: string }[] }; profiles: { id: string; firstname: string; lastname: string; username: string } }) {
          this.id = id
          this.profileId = profile_id
          this.boatId = boat_id
          this.title = title
          this.description = description
          this.price = price
          this.isAvailable = is_available
          this.equipments = equipments
          this.isSkipperAvailable = is_skipper_available
          this.isTeamAvailable = is_team_available
          this.rentalPeriod = rental_period
          this.location = location
          this.deletedAt = deleted_at
          this.boat = {
               id: boat.id,
               name: boat.boat_name,
               images: boat.boat_images.map((image: { id: string; url: string; caption: string }) => ({
                    id: image.id,
                    url: image.url,
                    caption: image.caption,
               })),
          }
          this.profile = {
               id: profiles.id,
               firstname: profiles.firstname,
               lastname: profiles.lastname,
               username: profiles.username,
          }
     }

     static fromRawData(data: any): GetSingleOfferDTO {
          return new GetSingleOfferDTO({
               id: data.id,
               profile_id: data.profile_id,
               boat_id: data.boat_id,
               title: data.title,
               description: data.description,
               price: data.price,
               is_available: data.is_available,
               equipments: data.equipments || [],
               is_skipper_available: data.is_skipper_available,
               is_team_available: data.is_team_available,
               rental_period: data.rental_period,
               location: data.location,
               deleted_at: data.deleted_at,
               boat: {
                    id: data.boats.id,
                    boat_name: data.boats.boat_name,
                    boat_images: data.boats.boat_images,
               },
               profiles: data.profiles,
          })
     }
}
