import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

export const getOffersUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<OfferEntity[] | []> => {
     try {
          const offers = await OfferRepositorySupabase.getOffers()
          if (!offers || offers.length === 0) {
               return []
          }

          return offers as OfferEntity[] | []
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: (error as Error).message })

          throw error as Error
     }
}
