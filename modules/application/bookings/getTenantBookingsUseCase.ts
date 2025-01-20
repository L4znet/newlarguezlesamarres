import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"

export const getTenantBookingsUseCase = async (bookingRepository: BookingRepository): Promise<GetTenantsBookingsDTO[] | []> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id as string

          return bookingRepository.getTenantBookings(profileId)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
