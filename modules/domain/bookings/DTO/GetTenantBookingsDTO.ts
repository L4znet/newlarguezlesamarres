export type ProfileRawData = {
     profile_lastname: string
     profile_firstname: string
     profile_email: string
     profile_username: string
}

export type BoatImageRawData = {
     id: string
     url: string
     caption: string
}

export type OffersRawData = {
     offer_id: string
     offer_title: string
     offer_description: string
     offer_price: string
     offer_rentals: string
}

export type BoatsRawData = {
     boat_name: string
     boat_images: BoatImageRawData[]
}

export class GetTenantsBookingsDTO {
     public offerId: string
     public userId: string
     public startDate: string
     public endDate: string
     public status: string
     public boatType: number
     public profile: ProfileRawData[]
     public offers: OffersRawData[]
     public boats: BoatsRawData[]

     constructor(data: any) {
          this.offerId = data.offer_id
          this.userId = data.user_id
          this.startDate = data.start_date
          this.endDate = data.end_date
          this.status = data.status
          this.boatType = data.boat_type
          this.profile = data.profiles
          this.offers = data.offers
          this.boats = data.boats
     }

     static fromRawData(data: any): GetTenantsBookingsDTO {
          return new GetTenantsBookingsDTO(data)
     }
}
