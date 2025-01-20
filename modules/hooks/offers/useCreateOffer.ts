import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOfferUseCase } from "@/modules/application/offers/createOfferUseCase"

import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { router } from "expo-router"
import { makeCreateOfferUseCase } from "@/modules/orchestration/OfferUseCaseFactory"
import { CreateOfferDTO } from "@/modules/domain/offers/DTO/CreateOfferDTO"

export const useCreateOffer = () => {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const createOffer = makeCreateOfferUseCase()

     return useMutation({
          mutationFn: async (offerData: CreateOfferDTO) => {
               return await createOffer(offerData)
          },
          onSuccess: (createdOffer) => {
               if (createdOffer) {
                    showTranslatedFlashMessage("success", {
                         title: "flash_title_success",
                         description: "Offer created",
                    })

                    router.push("/(app)/(tabs)/(offers)")

                    queryClient.invalidateQueries({ queryKey: ["offers"] })
                    queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
               }
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: error.message,
               })
          },
     })
}
