import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"

export async function isOfferReservedUseCase(offerId: string): Promise<boolean> {
     const { offerReserved } = await BookingRepositorySupabase.getBookingStatus(offerId, null)
     return offerReserved
}
