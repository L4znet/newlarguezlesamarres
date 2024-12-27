import supabase from "@/supabaseClient"
import OfferRepository from "@/modules/domain/offers/OfferRepository"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { undefined } from "zod"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, Location, RentalPeriod } from "@/interfaces/Offer"
import { ProfileUpdateSchema } from "@/modules/domain/profile/schemas/ProfileUpdateSchema"

class OfferRepositorySupabase implements OfferRepository {
     async createOffer({ profileId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt = null }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferEntity | undefined> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .insert({
                    profile_id: profileId,
                    boat_id: boatId,
                    title: title,
                    description: description,
                    price: price,
                    is_available: isAvailable,
                    frequency: frequency,
                    equipments: equipments,
                    is_skipper_available: isSkipperAvailable,
                    is_team_available: isTeamAvailable,
                    rental_period: rentalPeriod,
                    location: location,
                    deleted_at: deletedAt,
               })
               .single()

          if (offerError) {
               throw new Error(`Error creating offer: ${offerError.message}`)
          }

          if (offerData) {
               return OfferEntity.fromSupabaseData(offerData)
          }
     }

     async updateOffer({ offerId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; isArchived?: boolean }): Promise<OfferEntity | undefined> {
          if (!offerId) {
               throw new Error("Invalid offerId: " + offerId)
          }

          try {
               const { data: offerData, error: offerError } = await supabase
                    .from("offers")
                    .update({
                         boat_id: boatId,
                         title: title,
                         description: description,
                         price: price,
                         is_available: isAvailable,
                         frequency: frequency,
                         equipments: equipments,
                         is_skipper_available: isSkipperAvailable,
                         is_team_available: isTeamAvailable,
                         rental_period: rentalPeriod,
                         location: location,
                    })
                    .eq("id", offerId)
                    .select()

               if (offerData?.length) {
                    return OfferEntity.fromSupabaseData(offerData[0])
               }
          } catch (error) {
               console.log(offerId)
               console.log("sdffdsqsfdfdqqfsdsfdqsfd", error)
               throw new Error((error as Error).message)
          }
     }

     async getSingleOffer({ offerId }: { offerId: string }): Promise<OfferEntity> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .select(
                    `
            *,
            boats (
                id,
                boat_name,
                boat_images (url)
            ),
            profiles (
                id,
                firstname,
                lastname,
                username)
        `
               )
               .eq("id", offerId)

          if (offerError) {
               throw new Error(`Error fetching offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return OfferEntity.fromSupabaseData(offerData[0])
          }

          throw new Error("No data returned from offer fetch.")
     }

     async getOffers({ profileId }: { profileId: string }): Promise<OfferEntity[] | undefined> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .select(
                    `
            *,
            boats (
                id,
                boat_name,
                boat_images (url)
            ),
            profiles (
                id,
                firstname,
                lastname,
                username)
        `
               )
               .eq("profile_id", profileId)

          if (offerError) {
               throw new Error(`Error fetching offers: ${offerError.message}`)
          }

          if (offerData?.length) {
               return offerData.map((offer: any) => OfferEntity.fromSupabaseData(offer))
          }
     }

     async deleteOffer({ profileId, offerId }: { profileId: string; offerId: string }): Promise<OfferEntity | undefined> {
          const offerIdString = offerId

          const { data: offerData, error: offerError } = await supabase.from("offers").delete().eq("id", offerIdString).eq("profile_id", profileId).select()

          if (offerError) {
               throw new Error(`Error deleting offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return OfferEntity.fromSupabaseData(offerData[0])
          }

          throw new Error("No data returned from offer deletion.")
     }

     async selectBoats(profileId: string | undefined): Promise<BoatEntity | undefined> {
          const boats = BoatRepositorySupabase.getBoats(profileId)

          if (boats) {
               return BoatEntity.fromSupabaseData(boats)
          }
     }
}

export default new OfferRepositorySupabase()
