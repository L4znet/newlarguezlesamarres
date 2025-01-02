import { useMutation } from "@tanstack/react-query"
import { fetchPayment } from "@/modules/api/stripe"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

interface PaymentVariables {
     accessToken: string
     offerId: string
     currency: string
     amount: number
     userId: string
}

export const useStripePayment = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (variables: PaymentVariables) => {
               const { accessToken, offerId, currency, userId, amount } = variables

               try {
                    const payment = await fetchPayment(accessToken, offerId, currency, amount, userId)

                    console.log("Payment", payment)

                    return payment
               } catch (error) {
                    throw new Error(`Payment failed: ${(error as Error).message}`)
               }
          },
          onSuccess: (data) => {},
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "An error occurred while processing your payment. Please try again.",
               })
               console.error("Payment error:", error)
          },
     })
}
