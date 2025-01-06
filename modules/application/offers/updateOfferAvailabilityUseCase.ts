import { MessageType } from "react-native-flash-message"
import { Equipment, Offer, RentalPeriod } from "@/interfaces/Offer"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { router } from "expo-router"

export const updateOfferAvailabilityUseCase = async (
     {
          offerId: offerId,
          isAvailable: isAvailable,
     }: {
          offerId: string
          isAvailable: boolean
     },
     showTranslatedFlashMessage: (type: MessageType, message: { title: string; description: string }) => void
): Promise<void> => {
     try {
          const updatedOffer = await OfferRepositorySupabase.updateOfferAvailability({
               offerId: offerId,
               isAvailable: isAvailable,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
