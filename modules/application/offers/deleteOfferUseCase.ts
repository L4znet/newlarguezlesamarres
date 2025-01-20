import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const deleteOfferUseCase = async (offerRepository: OfferRepository, offerId: string): Promise<OfferIdResponseDTO | undefined> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (profileId) {
               return await offerRepository.deleteOffer({ profileId, offerId })
          }
     } catch (error) {
          throw new Error("Error deleting offer" + error)
     }
}
