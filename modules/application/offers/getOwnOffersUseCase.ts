import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { MessageType } from "react-native-flash-message"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"

export const getOwnOffersUseCase = async (
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
): Promise<GetOffersDTO[] | []> => {
     const session = await getCurrentSessionUseCase()
     const profileId = session.data.session?.user.id as string

     if (!profileId) {
          showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "Profile ID is missing" })
     }

     try {
          const offers = await OfferRepositorySupabase.getOwnOffers(profileId)

          if (!offers || offers.length === 0) {
               return []
          }

          return offers
     } catch (error) {
          showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: (error as Error).message })

          throw error as Error
     }
}
