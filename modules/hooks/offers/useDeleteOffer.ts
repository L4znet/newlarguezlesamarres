import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { deleteOfferUseCase } from "@/modules/application/offers/deleteOfferUseCase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import { makeDeleteOfferUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useDeleteOffer() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     const deleteOffer = makeDeleteOfferUseCase()
     return useMutation({
          mutationFn: async (offerId: string): Promise<OfferIdResponseDTO | undefined> => {
               return await deleteOffer(offerId)
          },
          onSuccess: (deletedOfferId) => {
               if (deletedOfferId) {
                    showTranslatedFlashMessage("success", {
                         title: "flash_title_success",
                         description: "Offer deleted successfully!",
                    })

                    queryClient.invalidateQueries({ queryKey: ["offers"] })
                    queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
               }
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
