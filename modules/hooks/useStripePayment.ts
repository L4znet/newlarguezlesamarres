import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchLocations } from "../api/tomtom"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { fetchPayment } from "@/modules/api/stripe"

export const useStripePayment = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useMutation({
          mutationFn: (variables: { accessToken: string; offerId: string; currency: string; amount: number; userId: string }) => {
               const { accessToken, offerId, currency, userId, amount } = variables
               return fetchPayment(accessToken, offerId, currency, amount, userId)
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "An error occurred while searching for locations",
               })
          },
     })
}
