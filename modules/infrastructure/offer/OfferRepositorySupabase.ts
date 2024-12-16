import supabase from "@/supabaseClient"
import OfferRepository from "@/modules/domain/offers/OfferRepository"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { undefined } from "zod"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

class OfferRepositorySupabase implements OfferRepository {
     async createOffer(profileId: string | undefined, title: string, description: string, price: number, isAvailable: boolean, frequency: number, equipments: any[], isSkipperAvailable: boolean, isTeamAvailable: boolean, rentalPeriod: any[], location: any, isArchived: boolean, deletedAt: Date | undefined): Promise<OfferEntity | undefined> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .insert({
                    profile_id: profileId,
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
                    is_archived: isArchived,
                    deleted_at: deletedAt,
               })
               .select()

          if (offerError) {
               throw new Error(`Error creating offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return OfferEntity.fromSupabaseData(offerData[0])
          }

          throw new Error("No data returned from offer creation.")
     }

     async updateOffer(profileId: string | undefined, title: string, description: string, price: number, isAvailable: boolean, frequency: number, equipments: any[], isSkipperAvailable: boolean, isTeamAvailable: boolean, rentalPeriod: any[], location: any, isArchived: boolean, deletedAt: Date | undefined, offerId: string | string[]): Promise<OfferEntity | undefined> {
          const offerIdString = offerId

          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .update({
                    profile_id: profileId,
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
                    is_archived: isArchived,
                    deleted_at: deletedAt,
               })
               .eq("id", offerIdString)
               .select()

          if (offerError) {
               throw new Error(`Error updating offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return OfferEntity.fromSupabaseData(offerData[0])
          }

          throw new Error("No data returned from offer update.")
     }

     async getSingleOffer(offerId: string | string[]): Promise<OfferEntity> {
          const offerIdString = offerId

          const { data: offerData, error: offerError } = await supabase.from("offers").select().eq("id", offerIdString)

          if (offerError) {
               throw new Error(`Error fetching offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return OfferEntity.fromSupabaseData(offerData[0])
          }

          throw new Error("No data returned from offer fetch.")
     }

     async getOffers(profileId: string | undefined): Promise<OfferEntity[] | undefined> {
          const { data: offerData, error: offerError } = await supabase.from("offers").select().eq("profile_id", profileId)

          if (offerError) {
               throw new Error(`Error fetching offers: ${offerError.message}`)
          }

          if (offerData?.length) {
               return offerData.map((offer: any) => OfferEntity.fromSupabaseData(offer))
          }

          return undefined
     }

     async deleteOffer(profileId: string | undefined, offerId: string): Promise<OfferEntity | undefined> {
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
