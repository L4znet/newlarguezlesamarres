import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const getOffersUseCase = async (
     setLoader: (value: boolean) => void,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     setLoader(true)

     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id

     try {
          const offers = await OfferRepositorySupabase.getOffers(profileId)

          if (offers) {
               showTranslatedFlashMessage("success", { title: "Offers loaded", description: "The offers have been successfully loaded." })
          } else {
               showTranslatedFlashMessage("danger", { title: "Error loading offers", description: "An error occurred while loading the offers." })
          }
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "Error loading offers", description: (error as Error).message })
     }

     setLoader(false)
}
