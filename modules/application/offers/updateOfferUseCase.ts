import { MessageType } from "react-native-flash-message"
import { Equipment, Offer, RentalPeriod } from "@/interfaces/Offer"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { router } from "expo-router"

export const updateOfferUseCase = async (
     {
          id,
          boatId,
          title,
          description,
          price,
          isAvailable,
          equipments,
          isSkipperAvailable,
          isTeamAvailable,
          rentalPeriod,
          location,
     }: {
          id: string
          boatId: string
          title: string
          description: string
          price: string
          isAvailable: boolean
          equipments: Equipment[]
          isSkipperAvailable: boolean
          isTeamAvailable: boolean
          rentalPeriod: RentalPeriod
          location: { city: string; country: string; zipcode: string; address: string }
     },
     showTranslatedFlashMessage: (type: MessageType, message: { title: string; description: string }) => void
): Promise<void> => {
     try {
          const updatedOffer = await OfferRepositorySupabase.updateOffer({
               offerId: id,
               boatId: boatId,
               title: title,
               description: description,
               price: price,
               isAvailable: isAvailable,
               equipments: equipments,
               isSkipperAvailable: isSkipperAvailable,
               isTeamAvailable: isTeamAvailable,
               rentalPeriod: rentalPeriod,
               location: location,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
