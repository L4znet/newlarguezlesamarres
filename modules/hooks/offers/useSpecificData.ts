import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { router } from "expo-router"
import { Equipment } from "@/interfaces/Offer"
import { getSpecificOfferDataUseCase } from "@/modules/application/offers/getSpecificOfferDataUseCase"
import { useOfferStore } from "@/modules/stores/offerStore"

export function useSpecificData() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { setTemporaryLocation } = useOfferStore()

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
