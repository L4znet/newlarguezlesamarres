import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { getOwnerBookingsUseCase } from "@/modules/application/bookings/getOwnerBookingsUseCase"

export function useOwnerBookings() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery<BookingEntity[]>({
          queryKey: ["bookings"],
          queryFn: () => getOwnerBookingsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
