import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const getOwnOffersUseCase = async (offerRepository: OfferRepository): Promise<GetOffersDTO[] | []> => {
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id as string

     try {
          const offers = await offerRepository.getOwnOffers(profileId)

          if (!offers || offers.length === 0) {
               return []
          }

          return offers
     } catch (error) {
          console.log("error", error)
          throw error as Error
     }
}
