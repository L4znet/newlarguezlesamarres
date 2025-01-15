import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { getOwnerBookingsUseCase } from "@/modules/application/bookings/getOwnerBookingsUseCase"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"

export function useOwnerBookings() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery<GetOwnerBookingsDTO[] | undefined>({
          queryKey: ["owner_bookings"],
          queryFn: () => getOwnerBookingsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
