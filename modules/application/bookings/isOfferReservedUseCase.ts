import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import { GetBookingStatusDTO } from "@/modules/domain/bookings/DTO/GetBookingStatusDTO"

export async function isOfferReservedUseCase(bookingRepository: BookingRepository, offerId: string): Promise<GetBookingStatusDTO | []> {
     return await bookingRepository.getBookingStatus(offerId, null)
}
