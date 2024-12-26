import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export const getSingleOfferUseCase = async (offerId: string): Promise<OfferEntity> => {
     try {
          return await OfferRepositorySupabase.getSingleOffer({ offerId })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
