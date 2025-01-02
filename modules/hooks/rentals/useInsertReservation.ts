import { useMutation } from "@tanstack/react-query"
import { insertReservation } from "@/modules/api/supabase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

interface InsertReservationVariables {
     offerId: string
     userId: string
     startDate: string
     endDate: string
     accessToken: string
}

interface InsertReservationResponse {
     reservationId: string
}

export const useInsertReservation = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation<InsertReservationResponse, Error, InsertReservationVariables>({
          mutationFn: async (variables) => {
               return insertReservation(variables)
          },

          onError: (error) => {
               console.error("Reservation insertion error:", error)
               showTranslatedFlashMessage("danger", {
                    title: "Reservation Error",
                    description: "An error occurred while creating your reservation.",
               })
          },
     })
}
