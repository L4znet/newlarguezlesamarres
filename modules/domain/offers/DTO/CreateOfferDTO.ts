export interface Equipment {
     equipmentName: string
     equipmentQuantity: string
}

export interface RentalPeriod {
     start: string
     end: string
}

export interface Location {
     city: string
     country: string
     zipcode: string
     address: string
}

export class CreateOfferDTO {
     public readonly profileId: string
     public readonly boatId: string
     public readonly title: string
     public readonly description: string
     public readonly price: string
     public readonly isAvailable: boolean
     public readonly equipments: Equipment[]
     public readonly isSkipperAvailable: boolean
     public readonly isTeamAvailable: boolean
     public readonly rentalPeriod: RentalPeriod
     public readonly location: Location
     public readonly deletedAt: Date | null

     constructor({ profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }) {
          this.profileId = profileId
          this.boatId = boatId
          this.title = title
          this.description = description
          this.price = price
          this.isAvailable = isAvailable
          this.equipments = equipments
          this.isSkipperAvailable = isSkipperAvailable
          this.isTeamAvailable = isTeamAvailable
          this.rentalPeriod = rentalPeriod
          this.location = location
          this.deletedAt = deletedAt
     }

     static toRawData(dto: CreateOfferDTO): any {
          return {
               profile_id: dto.profileId,
               boat_id: dto.boatId,
               title: dto.title,
               description: dto.description,
               price: dto.price,
               is_available: dto.isAvailable,
               equipments: dto.equipments,
               is_skipper_available: dto.isSkipperAvailable,
               is_team_available: dto.isTeamAvailable,
               rental_period: dto.rentalPeriod,
               location: dto.location,
               deleted_at: dto.deletedAt,
          }
     }
}
