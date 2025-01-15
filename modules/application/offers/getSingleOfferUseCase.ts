import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"

export const getSingleOfferUseCase = async (offerId: string): Promise<GetSingleOfferDTO | undefined> => {
     try {
          return await OfferRepositorySupabase.getSingleOffer({ offerId })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
