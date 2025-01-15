import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { MessageType } from "react-native-flash-message"
import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import BookingRepositorySupabase from "@/modules/infrastructure/booking/BookingRepositorySupabase"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"

export const getOwnerBookingsUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<GetOwnerBookingsDTO[] | undefined> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id as string

          const bookings = await BookingRepositorySupabase.getOwnerBookings(profileId)

          if (!bookings) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "An error occurred while loading the bookings." })
          }

          return bookings
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
