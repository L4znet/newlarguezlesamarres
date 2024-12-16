import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

interface OfferRepository {
     selectBoats(profileId: string | undefined): Promise<BoatEntity | undefined>
     createOffer(): Promise<OfferEntity | undefined>
     updateOffer(): Promise<OfferEntity | undefined>
     deleteOffer(): Promise<OfferEntity | undefined>
     getSingleOffer(): Promise<OfferEntity>
     getOffers(): Promise<OfferEntity[] | undefined>
}

export default OfferRepository
