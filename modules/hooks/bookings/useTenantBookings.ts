import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTenantBookingsUseCase } from "@/modules/application/bookings/getTenantBookingsUseCase"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"

export function useTenantBookings() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery<GetTenantsBookingsDTO[] | []>({
          queryKey: ["tenant_bookings"],
          queryFn: () => getTenantBookingsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
