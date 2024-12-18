import { useQuery } from "@tanstack/react-query"
import { getOffersUseCase } from "@/modules/application/offers/getOffersUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useOffers() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useQuery({
          queryKey: ["offers"],
          queryFn: () => getOffersUseCase(showTranslatedFlashMessage),
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          staleTime: Infinity,
     })
}
