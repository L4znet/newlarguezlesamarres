import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { router } from "expo-router"
import { Equipment } from "@/interfaces/Offer"
import { updateOfferAvailabilityUseCase } from "@/modules/application/offers/updateOfferAvailabilityUseCase"
import { makeUpdateOfferAvailabilityUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useUpdateOfferAvailability() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     const updateOfferAvailability = makeUpdateOfferAvailabilityUseCase()

     return useMutation({
          mutationFn: async ({ isAvailable, offerId }: { isAvailable: boolean; offerId: string }) => {
               try {
                    return updateOfferAvailability(offerId, isAvailable)
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
