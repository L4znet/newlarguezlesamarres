import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getOwnOffersUseCase } from "@/modules/application/offers/getOwnOffersUseCase"

export function useOwnOffers() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery<OfferEntity[]>({
          queryKey: ["ownOffers"],
          queryFn: () => getOwnOffersUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
