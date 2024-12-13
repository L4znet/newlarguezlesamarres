import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"

export const deleteOfferUseCase = async (
     setLoader: (value: boolean) => void,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void,
     profileId: string | undefined,
     offerId: string
) => {
     setLoader(true)

     try {
          const deletedOffer = await OfferRepositorySupabase.deleteOffer(profileId, offerId)

          if (deletedOffer) {
               showTranslatedFlashMessage("success", { title: "Offer deleted", description: "The offer has been successfully deleted." })
          } else {
               showTranslatedFlashMessage("danger", { title: "Error deleting offer", description: "An error occurred while deleting the offer." })
          }
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "Error deleting offer", description: (error as Error).message })
     }

     setLoader(false)
}
