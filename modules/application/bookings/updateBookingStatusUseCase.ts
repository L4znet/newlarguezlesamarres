import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import { router } from "expo-router"
import { BookingIdResponseDTO } from "@/modules/domain/bookings/DTO/BookingIdResponseDTO"
import BookingRepository from "@/modules/domain/bookings/BookingRepository"

export async function updateBookingStatusUseCase(bookingRepository: BookingRepository, bookingId: string, status: string): Promise<BookingIdResponseDTO> {
     try {
          return await bookingRepository.updateBookingStatus(bookingId, status)
     } catch (error) {
          console.error("Failed to update booking status:", error)
          throw error
     }
}
