import { MessageType } from "react-native-flash-message"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const updateOfferAvailabilityUseCase = async (offerRepository: OfferRepository, offerId: string, isAvailable: boolean): Promise<OfferIdResponseDTO | undefined> => {
     try {
          return await offerRepository.updateOfferAvailability({
               offerId: offerId,
               isAvailable: isAvailable,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
