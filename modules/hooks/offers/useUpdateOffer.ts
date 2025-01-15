import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { router } from "expo-router"
import { Equipment } from "@/interfaces/Offer"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"

export function useUpdateOffer() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ offerId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: { start: string; end: string }; location: { city: string; country: string; zipcode: string; address: string } }): Promise<OfferIdResponseDTO | undefined> => {
               try {
                    return await updateOfferUseCase({
                         offerId: offerId,
                         boatId: boatId,
                         title: title,
                         description: description,
                         price: price,
                         isAvailable: isAvailable,
                         equipments: equipments,
                         isSkipperAvailable: isSkipperAvailable,
                         isTeamAvailable: isTeamAvailable,
                         rentalPeriod: rentalPeriod,
                         location: location,
                    })
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: (updateOffer) => {
               if (updateOffer) {
                    queryClient.invalidateQueries({ queryKey: ["offers"] })
                    queryClient.invalidateQueries({ queryKey: ["offer"] })
                    queryClient.invalidateQueries({ queryKey: ["ownOffers"] })

                    router.push("/(app)/(tabs)/(offers)")

                    showTranslatedFlashMessage("success", {
                         title: "flash_title_success",
                         description: "Offer updated successfully!",
                    })
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
