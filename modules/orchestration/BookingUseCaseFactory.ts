import { createBookingUseCase } from "@/modules/application/bookings/createBookingUseCase"
import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import { getTenantBookingsUseCase } from "@/modules/application/bookings/getTenantBookingsUseCase"
import { getOwnerBookingsUseCase } from "@/modules/application/bookings/getOwnerBookingsUseCase"
import { getBookingStatusUseCase } from "@/modules/application/bookings/getBookingStatusUseCase"
import { updateBookingStatusUseCase } from "@/modules/application/bookings/updateBookingStatusUseCase"

export const makeCreateBookingUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (params: { offerId: string; startDate: string; endDate: string; status: string }) => createBookingUseCase(bookingRepository, params)
}

export const makeGetTenantBookingsUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return () => getTenantBookingsUseCase(bookingRepository)
}

export const makeGetOwnerBookingsUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return () => getOwnerBookingsUseCase(bookingRepository)
}

export const makeBookingStatus = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (offerId: string) => getBookingStatusUseCase(bookingRepository, offerId)
}

export const makeUpdateBookingStatusUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (bookingId: string, status: string) => updateBookingStatusUseCase(bookingRepository, bookingId, status)
}
