import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { Equipment } from "@/interfaces/Offer"
import { getSpecificOfferDataUseCase } from "@/modules/application/offers/getSpecificOfferDataUseCase"

export function useSpecificData() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ offerId, dataToSearch }: { offerId: string; dataToSearch: string }) => {
               try {
                    return getSpecificOfferDataUseCase(offerId, dataToSearch)
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: (data: {
               equipment: Equipment[]
               location: {
                    city: string
                    country: string
                    zipcode: string
                    address: string
               }
          }) => {
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
