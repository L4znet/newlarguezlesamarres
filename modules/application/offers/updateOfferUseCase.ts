import { Equipment, RentalPeriod } from "@/interfaces/Offer"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const updateOfferUseCase = async (offerRepository: OfferRepository, { offerId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: { city: string; country: string; zipcode: string; address: string } }): Promise<OfferIdResponseDTO | undefined> => {
     try {
          return await offerRepository.updateOffer({
               offerId: offerId,
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
