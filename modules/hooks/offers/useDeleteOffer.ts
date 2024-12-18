import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { deleteOfferUseCase } from "@/modules/application/offers/deleteOfferUseCase"

export function useDeleteOffer() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (offerId: string) => {
               await deleteOfferUseCase(offerId, showTranslatedFlashMessage)
          },
          onSuccess: () => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Offer deleted successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["offers"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
