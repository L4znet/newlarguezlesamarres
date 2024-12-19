import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"

interface OfferRepository {
     selectBoats(profileId: string | undefined): Promise<BoatEntity | undefined>
     createOffer({ profileId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferEntity | undefined>
     updateOffer({ id, profileId, boatId, title, description, price, isAvailable, frequency, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { id: string; profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; frequency: number; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferEntity | undefined>
     deleteOffer({ offerId, profileId }: { offerId: string; profileId: string }): Promise<OfferEntity | undefined>
     getSingleOffer({ offerId }: { offerId: string }): Promise<OfferEntity>
     getOffers({ profileId }: { profileId: string }): Promise<OfferEntity[] | undefined>
}

export default OfferRepository
