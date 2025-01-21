import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { getOwnerBookingsUseCase } from "@/modules/application/bookings/getOwnerBookingsUseCase"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"
import { makeGetOwnerBookingsUseCase } from "@/modules/orchestration/BookingUseCaseFactory"

export function useOwnerBookings() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const getOwnerBookings = makeGetOwnerBookingsUseCase()

     return useQuery<GetOwnerBookingsDTO[] | undefined>({
          queryKey: ["owner_bookings"],
          queryFn: () => getOwnerBookings(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
