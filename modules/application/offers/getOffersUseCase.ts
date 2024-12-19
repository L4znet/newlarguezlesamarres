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
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id as string

     console.log("JE SUIS LAAAA OFFERS")

     if (!profileId) {
          showTranslatedFlashMessage("danger", { title: "Error loading offers", description: "Profile ID is missing" })
     }

     try {
          const offers = await OfferRepositorySupabase.getOffers({ profileId })
          if (!offers || offers.length === 0) {
               return []
          }

          return offers as OfferEntity[] | []
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "Error loading offers", description: (error as Error).message })

          throw error as Error
     }
}
