import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTenantBookingsUseCase } from "@/modules/application/bookings/getTenantBookingsUseCase"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"
import { makeGetTenantBookingsUseCase } from "@/modules/orchestration/BookingUseCaseFactory"

export function useTenantBookings() {
     const getTenantBookings = makeGetTenantBookingsUseCase()

     return useQuery<GetTenantsBookingsDTO[] | []>({
          queryKey: ["tenant_bookings"],
          queryFn: () => getTenantBookings(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
