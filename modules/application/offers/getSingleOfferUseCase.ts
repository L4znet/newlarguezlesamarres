import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export const getSingleOfferUseCase = async (offerId: string): Promise<OfferEntity> => {
     try {
          console.log("JE SUIS LAAAA SINGLE")
          const offer = await OfferRepositorySupabase.getSingleOffer({ offerId })
          return offer
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
