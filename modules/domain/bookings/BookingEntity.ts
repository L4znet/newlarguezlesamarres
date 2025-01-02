import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export default class BookingEntity {
     constructor(
          public readonly id: string,
          public readonly offerId: string,
          public readonly userId: string,
          public readonly startDate: string,
          public readonly endDate: string,
          public readonly status: string
     ) {}

     static fromSupabaseData(data: { id: string; offer_id: string; user_id: string; start_date: string; end_date: string; status: string }): BookingEntity {
          return new BookingEntity(data.id, data.offer_id, data.user_id, data.start_date, data.end_date, data.status)
     }

     static toSupabaseData(data: BookingEntity): any {
          return {
               id: data.id,
               offer_id: data.offerId,
               user_id: data.userId,
               start_date: data.startDate,
               end_date: data.endDate,
               status: data.status,
          }
     }
}
