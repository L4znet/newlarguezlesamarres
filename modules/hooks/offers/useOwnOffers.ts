import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getOwnOffersUseCase } from "@/modules/application/offers/getOwnOffersUseCase"
import { queryClient } from "@/queryClient"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"

export function useOwnOffers() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     const query = useQuery<GetOffersDTO[] | [], Error>({
          queryKey: ["ownOffers"],
          queryFn: () => getOwnOffersUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })

     if (query.isSuccess) {
          queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
     }

     return query
}
