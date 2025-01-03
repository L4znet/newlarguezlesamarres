import { useQuery } from "@tanstack/react-query"
import { isOfferReservedUseCase } from "@/modules/application/bookings/isOfferReservedUseCase"

export function useIsOfferReserved(offerId: string) {
     return useQuery({
          queryKey: ["isOfferReserved", offerId],
          queryFn: () => isOfferReservedUseCase(offerId),
          enabled: !!offerId,
          staleTime: Infinity,
     })
}
