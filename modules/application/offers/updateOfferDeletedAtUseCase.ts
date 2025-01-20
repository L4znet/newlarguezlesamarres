import { MessageType } from "react-native-flash-message"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const updateOfferOfferDeletedAtUseCase = async (offerRepository: OfferRepository, offerId: string, deletedAt: null | Date): Promise<OfferIdResponseDTO | undefined> => {
     try {
          return await offerRepository.updateOfferDeletedAt({
               offerId: offerId,
               deletedAt: deletedAt,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
