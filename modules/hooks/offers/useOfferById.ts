import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { useOfferStore } from "@/modules/stores/offerStore"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export function useOfferById(offerId: string) {
     return useQuery<OfferEntity, Error>({
          queryKey: ["offer", offerId],
          queryFn: () => getSingleOfferUseCase(offerId),
          enabled: !!offerId,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
     } as UseQueryOptions<OfferEntity, Error>)
}
