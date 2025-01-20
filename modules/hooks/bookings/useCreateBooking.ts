import { useMutation } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { queryClient } from "@/queryClient"
import { createBookingUseCase } from "@/modules/application/bookings/createBookingUseCase"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { makeCreateBookingUseCase } from "@/modules/orchestration/BookingUseCaseFactory"
import { BookingIdResponseDTO } from "@/modules/domain/bookings/DTO/BookingIdResponseDTO"

interface InsertBookingVariables {
     offerId: string
     startDate: string
     endDate: string
     status: string
}

export const useCreateBooking = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()

     const createBooking = makeCreateBookingUseCase()

     return useMutation<BookingIdResponseDTO | undefined, Error, InsertBookingVariables>({
          mutationFn: async (variables) => {
               return createBooking(variables)
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["bookings"] })
               queryClient.invalidateQueries({ queryKey: ["isOfferReserved"] })
               queryClient.invalidateQueries({ queryKey: ["hasUserReservedOffer"] })
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Your booking has been created successfully.",
               })
          },

          onError: (error) => {
               console.error("Booking insertion error:", error)
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: "An error occurred while creating your Booking.",
               })
          },
     })
}
