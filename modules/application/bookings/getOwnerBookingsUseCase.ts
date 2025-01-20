import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"

export const getOwnerBookingsUseCase = async (bookingRepository: BookingRepository): Promise<GetOwnerBookingsDTO[] | undefined> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id as string

          return await bookingRepository.getOwnerBookings(profileId)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
