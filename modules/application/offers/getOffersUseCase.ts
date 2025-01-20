import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { profile } from "@expo/fingerprint/build/utils/Profile"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const getOffersUseCase = async (offerRepository: OfferRepository): Promise<GetOffersDTO[] | []> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id as string

          const offers = await offerRepository.getOffers(profileId)
          if (!offers || offers.length === 0) {
               return []
          }

          return offers
     } catch (error) {
          throw error as Error
     }
}
