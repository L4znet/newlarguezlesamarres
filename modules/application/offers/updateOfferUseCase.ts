import { MessageType } from "react-native-flash-message"
import { Offer, RentalPeriod } from "@/interfaces/Offer"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"

export const updateOfferUseCase = async (
     {
          id,
          profileId,
          boatId,
          title,
          description,
          price,
          isAvailable,
          frequency,
          equipments,
          isSkipperAvailable,
          isTeamAvailable,
          rentalPeriod,
          location,
          deletedAt,
     }: {
          id: string
          profileId: string
          boatId: string
          title: string
          description: string
          price: string
          isAvailable: boolean
          frequency: number
          equipments: { name: string; quantity: string }[]
          isSkipperAvailable: boolean
          isTeamAvailable: boolean
          rentalPeriod: RentalPeriod
          location: { city: string; country: string; zipcode: string; address: string }
          deletedAt: Date | null
     },
     showTranslatedFlashMessage: (type: MessageType, message: { title: string; description: string }) => void
): Promise<void> => {
     const response = await OfferRepositorySupabase.updateOffer({
          id: id,
          profileId: profileId,
          boatId: boatId,
          title: title,
          description: description,
          price: price,
          isAvailable: isAvailable,
          frequency: frequency,
          equipments: equipments,
          isSkipperAvailable: isSkipperAvailable,
          isTeamAvailable: isTeamAvailable,
          rentalPeriod: rentalPeriod,
          location: location,
          deletedAt: deletedAt,
     })

     console.log("aaaaaaa", response)

     showTranslatedFlashMessage("success", {
          title: "Succès",
          description: "L'offre a été mise à jour avec succès.",
     })
}
