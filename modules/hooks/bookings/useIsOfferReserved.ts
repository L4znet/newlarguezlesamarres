import { useQuery } from "@tanstack/react-query"
import { isOfferReservedUseCase } from "@/modules/application/bookings/isOfferReservedUseCase"
import { makeIsOfferReservedUseCase } from "@/modules/orchestration/BookingUseCaseFactory"

export function useIsOfferReserved(offerId: string) {
     const isOfferReserved = makeIsOfferReservedUseCase()
     return useQuery({
          queryKey: ["isOfferReserved", offerId],
          queryFn: () => isOfferReserved(offerId),
          enabled: !!offerId,
          staleTime: Infinity,
     })
}
