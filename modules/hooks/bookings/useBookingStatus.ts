import { useQuery } from "@tanstack/react-query"
import { makeBookingStatus } from "@/modules/orchestration/BookingUseCaseFactory"

export function useBookingStatus(offerId: string) {
     const bookingStatus = makeBookingStatus()

     return useQuery({
          queryKey: ["bookingStatus", offerId],
          queryFn: () => bookingStatus(offerId),
          enabled: !!offerId,
          staleTime: Infinity,
     })
}
