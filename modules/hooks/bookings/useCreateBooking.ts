import { useMutation } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { queryClient } from "@/queryClient"
import { createBookingUseCase } from "@/modules/application/bookings/createBookingUseCase"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"

interface InsertBookingVariables {
     offerId: string
     userId: string
     startDate: string
     endDate: string
     status: string
}

export const useCreateBooking = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation<BookingEntity | undefined, Error, InsertBookingVariables>({
          mutationFn: async (variables) => {
               return createBookingUseCase(variables)
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["bookings"] })
               showTranslatedFlashMessage("success", {
                    title: "Booking Created",
                    description: "Your booking has been created successfully.",
               })
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
