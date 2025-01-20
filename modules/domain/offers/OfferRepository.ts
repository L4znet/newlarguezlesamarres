import OfferEntity from "@/modules/domain/offers/OfferEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Equipment, RentalPeriod, Location } from "@/interfaces/Offer"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import { CreateOfferDTO } from "@/modules/domain/offers/DTO/CreateOfferDTO"
import { OfferIdResponseDTO } from "@/modules/domain/offers/DTO/OfferIdResponseDTO"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"
import { GetSingleOfferDTO } from "@/modules/domain/offers/DTO/GetSingleOfferDTO"

interface OfferRepository {
     createOffer({ profileId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { profileId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location }): Promise<OfferIdResponseDTO | undefined>
     updateOffer({ offerId, boatId, title, description, price, isAvailable, equipments, isSkipperAvailable, isTeamAvailable, rentalPeriod, location }: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location }): Promise<OfferIdResponseDTO | undefined>
     deleteOffer({ offerId, profileId }: { offerId: string; profileId: string }): Promise<OfferIdResponseDTO | undefined>
     getSingleOffer({ offerId }: { offerId: string }): Promise<GetSingleOfferDTO | undefined>
     getOffers(profileId: string): Promise<GetOffersDTO[] | undefined>
     getOwnOffers(profileId: string): Promise<GetOffersDTO[] | undefined>
     updateOfferAvailability({ offerId, isAvailable }: { offerId: string; isAvailable: boolean }): Promise<OfferIdResponseDTO | undefined>
     updateOfferDeletedAt({ offerId, deletedAt }: { offerId: string; deletedAt: Date | null }): Promise<OfferIdResponseDTO | undefined>
}

export default OfferRepository
