import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import { GetBookingStatusDTO } from "@/modules/domain/bookings/DTO/GetBookingStatusDTO"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export async function hasUserReservedOfferUseCase(bookingRepository: BookingRepository, offerId: string): Promise<GetBookingStatusDTO | []> {
     try {
          const session = await getCurrentSessionUseCase()

          const profileId = session.data.session?.user.id as string
          return await bookingRepository.getBookingStatus(offerId, profileId)
     } catch (error) {
          console.error("Failed to get booking status:", error)
          throw error
     }
}
