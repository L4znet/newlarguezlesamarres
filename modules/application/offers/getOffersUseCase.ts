import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export const getOffersUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id

     if (!profileId) {
          showTranslatedFlashMessage("danger", { title: "User session not found", description: "User session not found." })
          return
     }

     try {
          if (profileId) {
               const offers = await OfferRepositorySupabase.getOffers({ profileId })

               if (!offers) {
                    showTranslatedFlashMessage("danger", { title: "Error loading offers", description: "An error occurred while loading the offers." })
               }

               console.log("offerffffs", offers as OfferEntity[])

               return offers as OfferEntity[]
          }
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "Error loading offers", description: (error as Error).message })
     }
}
