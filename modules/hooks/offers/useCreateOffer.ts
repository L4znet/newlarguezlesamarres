import { useMutation } from "@tanstack/react-query"
import { createOfferUseCase } from "@/modules/application/offers/createOfferUseCase"
import { Offer } from "@/interfaces/Offer"

export const useCreateOffer = (onSuccess?: () => void, onError?: (error: Error) => void) => {
     return useMutation({
          mutationFn: async (offer: Offer) => {
               console.log("Creating offer:", offer)
               await createOfferUseCase(offer)
          },
          onSuccess: (data) => {
               console.log("Offer created successfully:", data)
               if (onSuccess) onSuccess()
          },
          onError: (error) => {
               console.error("Error creating offer:", error)
               if (onError) onError(error)
          },
     })
}
