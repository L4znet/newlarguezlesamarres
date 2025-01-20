import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getOwnOffersUseCase } from "@/modules/application/offers/getOwnOffersUseCase"
import { queryClient } from "@/queryClient"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import { makeGetOwnOffersUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useOwnOffers() {
     const getOwnOffers = makeGetOwnOffersUseCase()

     const { isSuccess, data, isPending, error } = useQuery<GetOffersDTO[] | [], Error>({
          queryKey: ["ownOffers"],
          queryFn: () => getOwnOffers(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })

     if (isSuccess) {
          queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
     }

     return {
          data,
          isPending,
          error,
     }
}
