import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBookingStatusUseCase } from "@/modules/application/bookings/updateBookingStatusUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"

export function useUpdateBookingStatus() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
               try {
                    await updateBookingStatusUseCase(bookingId, status)
               } catch (error) {
                    throw new Error((error as Error).message)
               }
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["owner_bookings"] })
               queryClient.invalidateQueries({ queryKey: ["tenant_bookings"] })
               showTranslatedFlashMessage("success", {
                    title: "Booking Updated",
                    description: "The booking status has been updated successfully.",
               })
          },
          onError: (error) => {
               console.error(error)
               showTranslatedFlashMessage("danger", {
                    title: "Error",
                    description: "An error occurred while updating the booking status.",
               })
          },
     })
}
