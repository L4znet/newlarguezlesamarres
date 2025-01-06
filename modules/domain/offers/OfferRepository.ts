import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"

interface OfferRepository {
     selectBoats(profileId: string | undefined): Promise<BoatEntity | undefined>
     createOffer({ profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferEntity | undefined>
     updateOffer({ offerId, profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { offerId: string; profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferEntity | undefined>
     deleteOffer({ offerId, profileId }: { offerId: string; profileId: string }): Promise<OfferEntity | undefined>
     getSingleOffer({ offerId }: { offerId: string }): Promise<OfferEntity>
     getOffers(profileId: string): Promise<OfferEntity[] | undefined>
     getOwnOffers(profileId: string): Promise<OfferEntity[] | undefined>
}

export default OfferRepository
