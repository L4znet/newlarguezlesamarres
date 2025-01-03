import { RentalPeriod } from "@/interfaces/Offer"

interface BoatImage {
     id: string
     url: string
     caption: string | null
}

export default class BookingEntity {
     constructor(
          public readonly offerId: string,
          public readonly userId: string,
          public readonly startDate: string,
          public readonly endDate: string,
          public readonly status: string,
          public readonly offerTitle?: string,
          public readonly offerDescription?: string,
          public readonly offerPrice?: string,
          public readonly offerFrequency?: number,
          public readonly offerRentals?: RentalPeriod,
          public readonly boatName?: string,
          public readonly boatImages?: BoatImage[],
          public readonly profileLastname?: string,
          public readonly profileFirstname?: string,
          public readonly profileUsername?: string,
          public readonly profileEmail?: string,
          public readonly id?: string
     ) {}

     static fromSupabaseData(data: { id: string; offer_id: string; user_id: string; start_date: string; end_date: string; status: string; offer_title: string; offer_description: string; offer_price: string; offer_frequency: number; offer_rentals: RentalPeriod; boat_name: string; boat_images: { id: string; url: string; caption: string | null }[]; profile_lastname: string; profile_firstname: string; profile_username: string; profile_email: string }): BookingEntity {
          return new BookingEntity(
               data.offer_id,
               data.user_id,
               data.start_date,
               data.end_date,
               data.status,
               data.offer_title,
               data.offer_description,
               data.offer_price,
               data.offer_frequency,
               data.offer_rentals,
               data.boat_name,
               data.boat_images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    caption: img.caption,
               })),
               data.profile_lastname,
               data.profile_firstname,
               data.profile_username,
               data.profile_email,
               data.id
          )
     }

     static toSupabaseData(data: BookingEntity): any {
          return {
               offer_id: data.offerId,
               user_id: data.userId,
               start_date: data.startDate,
               end_date: data.endDate,
               status: data.status,
          }
     }
}
