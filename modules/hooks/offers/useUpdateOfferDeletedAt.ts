import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { makeUpdateOfferDeletedAtUseCase } from "@/modules/orchestration/OfferUseCaseFactory"

export function useUpdateOfferDeletedAt() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     const updateOfferDeletedAt = makeUpdateOfferDeletedAtUseCase()

     return useMutation({
          mutationFn: async ({ deletedAt, offerId }: { deletedAt: Date | null; offerId: string }) => {
               try {
                    return updateOfferDeletedAt(offerId, deletedAt)
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })

               showTranslatedFlashMessage("success", {
                    title: "flash_title_danger",
                    description: "Successfully updated offer deleted at",
               })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
