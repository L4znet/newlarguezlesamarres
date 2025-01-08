import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { useOfferStore } from "@/modules/stores/offerStore"

export const getSpecificOfferDataUseCase = async (offerId: string, dataToSelect: string): Promise<any> => {
     try {
          return await OfferRepositorySupabase.getSpecificOfferData({ offerId, dataToSelect })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
