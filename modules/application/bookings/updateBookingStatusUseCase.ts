import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import { router } from "expo-router"

export async function updateBookingStatusUseCase(bookingId: string, status: string): Promise<void> {
     try {
          return await BookingRepositorySupabase.updateBookingStatus(bookingId, status)
     } catch (error) {
          console.error("Failed to update booking status:", error)
          throw error
     }
}
