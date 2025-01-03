import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"

export async function hasUserReservedOfferUseCase(offerId: string, userId: string): Promise<boolean> {
     const { userHasReserved } = await BookingRepositorySupabase.getBookingStatus(offerId, userId)
     return userHasReserved
}
