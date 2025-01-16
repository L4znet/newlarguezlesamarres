import { MessageType } from "react-native-flash-message"
import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"

export const updateOfferOfferDeletedAt = async ({ offerId: offerId, deletedAt: deletedAt }: { offerId: string; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined> => {
     try {
          return await OfferRepositorySupabase.updateOfferDeletedAt({
               offerId: offerId,
               deletedAt: deletedAt,
          })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
