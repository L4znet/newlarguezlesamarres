import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"
import { makeGetSingleOfferUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useOfferById(offerId: string) {
     const getOfferById = makeGetSingleOfferUseCase()
     return useQuery<GetSingleOfferDTO | undefined, Error>({
          queryKey: ["offer", offerId],
          queryFn: () => getOfferById(offerId),
          enabled: !!offerId,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
     })
}
