import { useMutation } from "@tanstack/react-query"
import { createTransaction } from "@/modules/api/supabase"

interface CreateTransactionVariables {
     accessToken: string
     offerId: string
     amount: number
     userId: string
}

interface CreateTransactionResponse {
     paymentIntent: string
     clientSecret: string
     ephemeralKey: string
     customer: string
}

export const useCreateTransaction = () => {
     return useMutation<CreateTransactionResponse, Error, CreateTransactionVariables>({
          mutationFn: async (variables) => {
               return createTransaction(variables)
          },
          onError: (error) => {
               console.error("Failed to create transaction:", error)
          },
     })
}
