import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"

interface BookingRepository {
     getTenantBookings(userId: string): Promise<BookingEntity[] | undefined>
     getOwnerBookings(userId: string): Promise<BookingEntity[] | undefined>
     cancelBooking(bookingId: string): Promise<void>
     updateBookingStatus(bookingId: string, status: string): Promise<void>
}

export default BookingRepository
