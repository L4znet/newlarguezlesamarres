import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const createOfferUseCase = async ({ profileId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, isArchived = false, deletedAt = null }: { profileId: string; boatId: string; title: string; description: string; price: number; isAvailable: boolean; frequency: number; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; isArchived?: boolean; deletedAt: Date | null }): Promise<OfferEntity | undefined> => {
     try {
          if (!title) {
               throw new Error("Le titre est requis.")
          }
          if (price <= 0) {
               throw new Error("Le prix doit être supérieur à 0.")
          }

          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          return await OfferRepositorySupabase.createOffer({
               profileId,
               boatId,
               title,
               description,
               price,
               isAvailable,
               frequency,
               equipments,
               isSkipperAvailable,
               isTeamAvailable,
               rentalPeriod,
               location,
               deletedAt,
          })
     } catch (error: any) {
          console.error("Error in createOfferUseCase:", error.message)
          throw new Error(error.message)
     }
}
