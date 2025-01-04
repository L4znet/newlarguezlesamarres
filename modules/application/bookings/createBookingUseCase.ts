import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"

export const createBookingUseCase = async ({ offerId, userId, startDate, endDate, status }: { offerId: string; userId: string; startDate: string; endDate: string; status: string }) => {
     try {
          const response = await BookingRepositorySupabase.createBooking({
               offerId,
               userId,
               startDate,
               endDate,
               status,
          })

          return response

          //
          // return BookingEntity.from()
     } catch (error: any) {
          console.error("Error in create Booking Use case:", error.message)
          throw new Error(error.message)
     }
}
