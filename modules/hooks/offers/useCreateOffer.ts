import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOfferUseCase } from "@/modules/application/offers/createOfferUseCase"
import { Offer } from "@/interfaces/Offer"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export const useCreateOffer = (onSuccess?: () => void, onError?: (error: Error) => void) => {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useMutation({
          mutationFn: async (offer: Offer) => {
               console.log("Creating offer:", offer)
               await createOfferUseCase(offer)
          },
          onSuccess: (data) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Offer added successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["boats"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: error.message,
               })
          },
     })
}
