import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"

export const deleteOfferUseCase = async (offerId: string): Promise<OfferIdResponseDTO | undefined> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (profileId) {
               return await OfferRepositorySupabase.deleteOffer({ profileId, offerId })
          }
     } catch (error) {
          throw new Error("Error deleting offer" + error)
     }
}
