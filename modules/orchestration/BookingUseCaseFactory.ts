import { createBookingUseCase } from "@/modules/application/bookings/createBookingUseCase"
import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import { getTenantBookingsUseCase } from "@/modules/application/bookings/getTenantBookingsUseCase"
import { getOwnerBookingsUseCase } from "@/modules/application/bookings/getOwnerBookingsUseCase"
import { hasUserReservedOfferUseCase } from "@/modules/application/bookings/hasUserReservedOfferUseCase"
import { isOfferReservedUseCase } from "@/modules/application/bookings/isOfferReservedUseCase"
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

export const makeHasUserReservedOfferUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (offerId: string) => hasUserReservedOfferUseCase(bookingRepository, offerId)
}

export const makeIsOfferReservedUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (offerId: string) => isOfferReservedUseCase(bookingRepository, offerId)
}

export const makeUpdateBookingStatusUseCase = () => {
     const bookingRepository = new BookingRepositorySupabase()
     return (bookingId: string, status: string) => updateBookingStatusUseCase(bookingRepository, bookingId, status)
}
