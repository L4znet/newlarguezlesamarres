import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { MessageType } from "react-native-flash-message"

export const createOfferUseCase = async (
     setLoader: (value: boolean) => void,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => OfferEntity
) => {}
