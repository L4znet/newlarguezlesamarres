import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getOffersUseCase } from "@/modules/application/offers/getOffersUseCase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import { makeGetOffersUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useOffers() {
     const getOffers = makeGetOffersUseCase()

     return useQuery<GetOffersDTO[]>({
          queryKey: ["offers"],
          queryFn: () => getOffers(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
