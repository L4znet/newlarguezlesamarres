import { useMutation } from "@tanstack/react-query"
import { insertBooking } from "@/modules/api/supabase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

interface InsertBookingVariables {
     offerId: string
     userId: string
     startDate: string
     endDate: string
     accessToken: string
}

interface InsertBookingResponse {
     bookingId: string
}

export const useInsertBooking = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation<InsertBookingResponse, Error, InsertBookingVariables>({
          mutationFn: async (variables) => {
               return insertBooking(variables)
          },

          onError: (error) => {
               console.error("Booking insertion error:", error)
               showTranslatedFlashMessage("danger", {
                    title: "Booking Error",
                    description: "An error occurred while creating your Booking.",
               })
          },
     })
}
