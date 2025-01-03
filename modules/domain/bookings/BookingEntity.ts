interface BoatImage {
     id: string
     url: string
     caption: string | null
}

export default class BookingEntity {
     constructor(
          public readonly id: string,
          public readonly offerId: string,
          public readonly userId: string,
          public readonly startDate: string,
          public readonly endDate: string,
          public readonly status: string,
          public readonly offerTitle: string,
          public readonly offerDescription: string,
          public readonly offerPrice: string,
          public readonly offerFrequency: number,
          public readonly boatName: string,
          public readonly boatImages: BoatImage[]
     ) {}

     static fromSupabaseData(data: { id: string; offer_id: string; user_id: string; start_date: string; end_date: string; status: string; offer_title: string; offer_description: string; offer_price: string; offer_frequency: number; boat_name: string; boat_images: { id: string; url: string; caption: string | null }[] }): BookingEntity {
          return new BookingEntity(
               data.id,
               data.offer_id,
               data.user_id,
               data.start_date,
               data.end_date,
               data.status,
               data.offer_title,
               data.offer_description,
               data.offer_price,
               data.offer_frequency,
               data.boat_name,
               data.boat_images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    caption: img.caption,
               }))
          )
     }

     static toSupabaseData(data: BookingEntity): any {
          return {
               id: data.id,
               offer_id: data.offerId,
               user_id: data.userId,
               start_date: data.startDate,
               end_date: data.endDate,
               status: data.status,
               offer_title: data.offerTitle,
               offer_description: data.offerDescription,
               offer_price: data.offerPrice,
               offer_frequency: data.offerFrequency,
               boat_name: data.boatName,
               boat_images: data.boatImages.map((img) => ({
                    id: img.id,
                    url: img.url,
                    caption: img.caption,
               })),
          }
     }
}
