import supabase from "@/supabaseClient"
import OfferRepository from "@/modules/domain/offers/OfferRepository"
import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { Equipment, Location, RentalPeriod } from "@/interfaces/Offer"
import { GetOffersDTO, OfferRawData } from "@/modules/domain/offers/DTO/GetOffersDTO"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"
import { CreateOfferDTO } from "@/modules/domain/offers/DTO/CreateOfferDTO"
import { $ } from "@faker-js/faker/dist/airline-BnpeTvY9"
import { UpdateOfferDTO } from "@/modules/domain/offers/DTO/UpdateOfferDTO"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"

class OfferRepositorySupabase implements OfferRepository {
     async createOffer({ profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt = null }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined> {
          const createOfferDTO = new CreateOfferDTO({
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
               deletedAt,
          })

          const {
               data: offerId,
               error: offerError,
          }: {
               data: { id: string } | null
               error: any
          } = await supabase.from("offers").insert(CreateOfferDTO.toRawData(createOfferDTO)).select("id").single()

          if (offerError) {
               throw new Error(`Error creating offer: ${offerError.message}`)
          }

          if (offerId) {
               return OfferIdResponseDTO.fromRawData(offerId)
          }
     }

     async updateOffer({ offerId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; isArchived?: boolean }): Promise<OfferIdResponseDTO | undefined> {
          console.log("Je passe là")
          try {
               console.log("Je passe ici")

               const updateOfferDTO = new UpdateOfferDTO({
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

               const {
                    data: offerIdResponse,
                    error,
               }: {
                    data: { id: string } | null
                    error: any
               } = await supabase.from("offers").update(UpdateOfferDTO.toRawData(updateOfferDTO)).eq("id", offerId).select("id").single()

               if (offerIdResponse) {
                    return OfferIdResponseDTO.fromRawData(offerIdResponse)
               }

               console.log(error)
          } catch (error) {
               console.log("Error", error)
               throw new Error((error as Error).message)
          }
     }

     async getSingleOffer({ offerId }: { offerId: string }): Promise<GetSingleOfferDTO | undefined> {
          const {
               data: offerIdResponse,
               error: offerError,
          }: {
               data: { id: string } | null
               error: any
          } = await supabase
               .from("offers")
               .select(
                    `
            *,
            boats (
                id,
                boat_name,
                boat_images (id, url, caption)
            ),
            profiles (
                id,
                firstname,
                lastname,
                username)
        `
               )
               .eq("id", offerId)
               .single()

          if (offerError) {
               throw new Error(`Error fetching offer: ${offerError.message}`)
          }

          if (offerIdResponse) {
               return GetSingleOfferDTO.fromRawData(offerIdResponse)
          }

          throw new Error("No data returned from offer fetch.")
     }

     async getOffers(profileId: string): Promise<GetOffersDTO[] | undefined> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .select(
                    `
            *,
            boats (
                id,
                boat_name,
                boat_images (id, url, caption)
            ),
            profiles (
                id,
                firstname,
                lastname,
                username)
        `
               )
               .order("created_at", {
                    ascending: false,
               })
               .eq("is_available", true)
               .neq("profile_id", profileId)

          if (offerError) {
               throw new Error(`Error fetching offers: ${offerError.message}`)
          }

          if (offerData?.length) {
               return offerData.map((offer: OfferRawData) => {
                    return GetOffersDTO.fromRawData(offer)
               })
          }
     }

     async getOwnOffers(profileId: string): Promise<GetOffersDTO[] | undefined> {
          const { data: offerData, error: offerError } = await supabase
               .from("offers")
               .select(
                    `
            *,
            boats (
                id,
                boat_name,
                boat_images (id, caption, url)
            ),
            profiles (
                id,
                firstname,
                lastname,
                username)
        `
               )
               .order("created_at", {
                    ascending: false,
               })
               .eq("profile_id", profileId)

          if (offerError) {
               throw new Error(`Error fetching offers: ${offerError.message}`)
          }

          if (offerData?.length) {
               return offerData.map((offer: OfferRawData) => {
                    return GetOffersDTO.fromRawData(offer)
               })
          }
     }

     async deleteOffer({ profileId, offerId }: { profileId: string; offerId: string }): Promise<OfferIdResponseDTO | undefined> {
          const { data: offerIdResponse, error: offerError } = await supabase.from("offers").delete().eq("id", offerId).eq("profile_id", profileId).select("id").single()

          if (offerError) {
               throw new Error(`Error deleting offer: ${offerError.message}`)
          }

          if (offerId) {
               return OfferIdResponseDTO.fromRawData(offerIdResponse)
          }

          throw new Error("No data returned from offer deletion.")
     }

     async selectBoats(profileId: string | undefined): Promise<GetBoatsDTO[] | undefined> {
          return BoatRepositorySupabase.getBoats(profileId)
     }

     async updateOfferAvailability({ isAvailable, offerId }: { isAvailable: boolean; offerId: string }): Promise<OfferIdResponseDTO | undefined> {
          const { data: offerIdResponse, error } = await supabase.from("offers").select("id").eq("is_available", isAvailable).eq("id", offerId).single()
          if (offerIdResponse) {
               return OfferIdResponseDTO.fromRawData(offerIdResponse)
          }
     }

     async getSpecificOfferData({ offerId, dataToSelect }: { offerId: string; dataToSelect: string }): Promise<any> {
          const { data: offerData, error: offerError } = await supabase.from("offers").select(dataToSelect).eq("id", offerId)

          if (offerError) {
               throw new Error(`Error fetching offer: ${offerError.message}`)
          }

          if (offerData?.length) {
               return offerData[0]
          }

          throw new Error("No data returned from offer fetch.")
     }
}

export default new OfferRepositorySupabase()
