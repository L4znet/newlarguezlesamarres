import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useUpdateOffer() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ id, profileId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { id: string; profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: { name: string; quantity: string }[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: { start: string; end: string }; location: { city: string; country: string; zipcode: string; address: string }; deletedAt: Date | null }) => {
               await updateOfferUseCase(
                    {
                         id: id,
                         profileId: profileId,
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
                         deletedAt: deletedAt,
                    },
                    showTranslatedFlashMessage
               )
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["offers"] })
          },
          onError: (error) => {
               console.error(error)

               console.error("Failed to update offer:", error)
          },
     })
}
