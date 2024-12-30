import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { profile } from "@expo/fingerprint/build/utils/Profile"

export const deleteOfferUseCase = async (
     offerId: string,
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (profileId) {
               const deletedOffer = await OfferRepositorySupabase.deleteOffer({ profileId, offerId })
               if (deletedOffer) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "The offer has been successfully deleted." })
               }
          }
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: (error as Error).message })
     }
}
