import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"

export function useOfferById(offerId: string) {
     return useQuery<GetSingleOfferDTO | undefined, Error>({
          queryKey: ["offer", offerId],
          queryFn: () => getSingleOfferUseCase(offerId),
          enabled: !!offerId,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
     })
}
