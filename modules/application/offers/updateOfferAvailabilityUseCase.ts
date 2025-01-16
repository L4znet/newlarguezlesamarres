import { MessageType } from "react-native-flash-message"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"

export const updateOfferAvailabilityUseCase = async (
     {
          offerId: offerId,
          isAvailable: isAvailable,
     }: {
          offerId: string
          isAvailable: boolean
     },
     showTranslatedFlashMessage: (type: MessageType, message: { title: string; description: string }) => void
): Promise<OfferIdResponseDTO | undefined> => {
     try {
          return await OfferRepositorySupabase.updateOfferAvailability({
               offerId: offerId,
               isAvailable: isAvailable,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
