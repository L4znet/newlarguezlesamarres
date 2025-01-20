import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const createBookingUseCase = async (bookingRepository: BookingRepository, { offerId, startDate, endDate, status }: { offerId: string; startDate: string; endDate: string; status: string }) => {
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id as string
     try {
          return await bookingRepository.createBooking({
               userId: profileId,
               offerId,
               startDate,
               endDate,
               status,
          })
     } catch (error: any) {
          console.error("Error in create Booking Use case:", error.message)
          throw new Error(error.message)
     }
}
