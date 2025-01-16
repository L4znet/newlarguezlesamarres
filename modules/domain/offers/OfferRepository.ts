import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import { CreateOfferDTO } from "@/modules/domain/offers/DTO/CreateOfferDTO"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"

interface OfferRepository {
     selectBoats(profileId: string | undefined): Promise<GetBoatsDTO[] | undefined>
     createOffer({ profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined>
     updateOffer({ offerId, profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location, deletedAt }: { offerId: string; profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined>
     deleteOffer({ offerId, profileId }: { offerId: string; profileId: string }): Promise<OfferIdResponseDTO | undefined>
     getSingleOffer({ offerId }: { offerId: string }): Promise<OfferIdResponseDTO | undefined>
     getOffers(profileId: string): Promise<GetOffersDTO[] | undefined>
     getOwnOffers(profileId: string): Promise<GetOffersDTO[] | undefined>
     updateOfferAvailability({ offerId, isAvailable }: { offerId: string; isAvailable: boolean }): Promise<OfferIdResponseDTO | undefined>
     updateOfferDeletedAt({ offerId, deletedAt }: { offerId: string; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined>
}

export default OfferRepository
