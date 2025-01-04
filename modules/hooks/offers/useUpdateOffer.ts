import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useUpdateOffer() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ id, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { id: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: { name: string; quantity: string }[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: { start: string; end: string }; location: { city: string; country: string; zipcode: string; address: string } }) => {
               try {
                    await updateOfferUseCase(
                         {
                              id: id,
                              boatId: boatId,
                              title: title,
                              description: description,
                              price: price,
                              isAvailable: isAvailable,
                              frequency: frequency,
                              equipments: equipments,
                              isSkipperAvailable: isSkipperAvailable,
                              isTeamAvailable: isTeamAvailable,
                              rentalPeriod: rentalPeriod,
                              location: location,
                         },
                         showTranslatedFlashMessage
                    )
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Offer updated successfully!",
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
