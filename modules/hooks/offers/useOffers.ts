import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getOffersUseCase } from "@/modules/application/offers/getOffersUseCase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"

export function useOffers() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useQuery<OfferEntity[]>({
          queryKey: ["offers"],
          queryFn: () => getOffersUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
