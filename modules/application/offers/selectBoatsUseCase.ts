import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const selectBoatsUseCase = async (
     setLoader: (value: boolean) => void,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => OfferEntity
) => {
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id

     const boats = await OfferRepositorySupabase.selectBoats(profileId)
}
