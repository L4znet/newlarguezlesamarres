import { useMutation } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { verifyAndInsertTransaction } from "@/modules/api/supabase"

export const useVerifyAndInsertTransaction = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (variables: { accessToken: string; paymentIntentId: string; offerId: string; userId: string }) => {
               return await verifyAndInsertTransaction(variables)
          },
          onSuccess: () => {
               showTranslatedFlashMessage("success", {
                    title: "Transaction Verified",
                    description: "The transaction has been verified and successfully inserted.",
               })
          },
          onError: (error) => {
               console.error("Transaction verification error:", error)
               showTranslatedFlashMessage("danger", {
                    title: "Transaction Error",
                    description: "An error occurred while verifying and inserting the transaction.",
               })
          },
     })
}
