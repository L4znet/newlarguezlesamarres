import { useQuery } from "@tanstack/react-query"
import { hasUserReservedOfferUseCase } from "@/modules/application/bookings/hasUserReservedOfferUseCase"

export function useHasUserReservedOffer(offerId: string, userId: string) {
     return useQuery({
          queryKey: ["hasUserReservedOffer", offerId, userId],
          queryFn: () => hasUserReservedOfferUseCase(offerId, userId),
          enabled: !!offerId && !!userId,
          staleTime: Infinity,
     })
}
