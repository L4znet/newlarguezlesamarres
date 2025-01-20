import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"
import { BookingIdResponseDTO } from "@/modules/domain/bookings/DTO/BookingIdResponseDTO"
import { GetBookingStatusDTO } from "@/modules/domain/bookings/DTO/GetBookingStatusDTO"

interface BookingRepository {
     getBookingStatus(offerId: string, userId: string | null): Promise<GetBookingStatusDTO[] | []>
     getTenantBookings(userId: string): Promise<GetTenantsBookingsDTO[] | []>
     getOwnerBookings(userId: string): Promise<GetOwnerBookingsDTO[] | []>
     updateBookingStatus(bookingId: string, status: string): Promise<BookingIdResponseDTO>
     createBooking(booking: { offerId: string; userId: string; startDate: string; endDate: string; status: string }): Promise<BookingIdResponseDTO | undefined>
}

export default BookingRepository
