import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import OfferRepository from "@/modules/domain/offers/OfferRepository"

export const createOfferUseCase = async (offerRepository: OfferRepository, { boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location }): Promise<OfferIdResponseDTO | undefined> => {
     try {
          if (!title) {
               throw new Error("Le titre est requis.")
          }
          if (parseInt(price) <= 0) {
               throw new Error("Le prix doit être supérieur à 0.")
          }

          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const id = await offerRepository.createOffer({
               profileId,
               boatId,
               title,
               description,
               price,
               isAvailable,
               equipments,
               isSkipperAvailable,
               isTeamAvailable,
               rentalPeriod,
               location,
          })

          router.push("/(app)/(tabs)/(home)")
          return id
     } catch (error: any) {
          throw new Error(error.message)
     }
}
