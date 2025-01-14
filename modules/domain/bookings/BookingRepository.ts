import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"
import { CreateBookingDTO } from "@/modules/domain/bookings/DTO/CreateBookingDTO"
import { BookingIdResponseDTO } from "@/modules/domain/bookings/DTO/BookingIdResponseDTO"

interface BookingRepository {
     getTenantBookings(userId: string): Promise<GetTenantsBookingsDTO[] | undefined>
     getOwnerBookings(userId: string): Promise<GetOwnerBookingsDTO[] | undefined>
     updateBookingStatus(bookingId: string, status: string): Promise<BookingIdResponseDTO>
     createBooking(booking: { offerId: string; userId: string; startDate: string; endDate: string; status: string }): Promise<BookingIdResponseDTO | undefined>
}

export default BookingRepository
