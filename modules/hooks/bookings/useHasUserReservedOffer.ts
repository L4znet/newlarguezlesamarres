import { useQuery } from "@tanstack/react-query"
import { hasUserReservedOfferUseCase } from "@/modules/application/bookings/hasUserReservedOfferUseCase"
import { makeHasUserReservedOfferUseCase } from "@/modules/orchestration/BookingUseCaseFactory"

export function useHasUserReservedOffer(offerId: string) {
     const hasUserReservedOffer = makeHasUserReservedOfferUseCase()

     return useQuery({
          queryKey: ["hasUserReservedOffer", offerId],
          queryFn: () => hasUserReservedOffer(offerId),
          enabled: !!offerId,
          staleTime: Infinity,
     })
}
