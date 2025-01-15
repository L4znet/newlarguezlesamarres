export class GetTenantsBookingsDTO {
     public id: string
     public offerId: string
     public userId: string
     public startDate: string
     public endDate: string
     public status: string
     public boatType: number
     public profileLastname: string
     public profileFirstname: string
     public profileEmail: string
     public profileUsername: string
     public offerTitle: string
     public offerDescription: string
     public offerPrice: string
     public offerRentals: string
     public offerProfileId: string
     public boatName: string
     public boatImages: { id: string; caption: string; url: string }[]

     constructor(data: any) {
          this.id = data.id
          this.offerId = data.offer_id
          this.userId = data.user_id
          this.startDate = data.start_date
          this.endDate = data.end_date
          this.status = data.status
          this.boatType = data.boat_type
          this.profileLastname = data.profile_lastname
          this.profileFirstname = data.profile_firstname
          this.profileEmail = data.profile_email
          this.profileUsername = data.profile_username
          this.offerTitle = data.offer_title
          this.offerDescription = data.offer_description
          this.offerPrice = data.offer_price
          this.offerRentals = data.offer_rentals
          this.offerProfileId = data.offer_profile_id
          this.boatName = data.boat_name
          this.boatImages = data.boat_images
     }

     static fromRawData(data: any): GetTenantsBookingsDTO {
          return new GetTenantsBookingsDTO(data)
     }
}
