import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOfferUseCase } from "@/modules/application/offers/createOfferUseCase"
import { useOfferStore } from "@/modules/stores/offerStore"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export const useCreateOffer = () => {
     const queryClient = useQueryClient()
     const { resetStore } = useOfferStore()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (offerData: any) => {
               return await createOfferUseCase(offerData)
          },
          onSuccess: (createdOffer) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Offer created",
               })

               resetStore()

               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: error.message,
               })
          },
     })
}
