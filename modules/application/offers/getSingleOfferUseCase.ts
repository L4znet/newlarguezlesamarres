import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const getSingleOfferUseCase = async (offerRepository: OfferRepository, offerId: string): Promise<GetSingleOfferDTO | undefined> => {
     try {
          return await offerRepository.getSingleOffer({ offerId })
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
