import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getTenantBookingsUseCase } from "@/modules/application/bookings/getTenantBookingsUseCase"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"

export function useTenantBookings() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery<BookingEntity[]>({
          queryKey: ["tenant_bookings"],
          queryFn: () => getTenantBookingsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
