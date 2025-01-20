import OfferRepositorySupabase from "@/modules/infrastructure/offer/OfferRepositorySupabase"
import { Equipment, Location, RentalPeriod } from "@/interfaces/Offer"
import { createOfferUseCase } from "@/modules/application/offers/createOfferUseCase"
import { updateOfferUseCase } from "@/modules/application/offers/updateOfferUseCase"
import { deleteOfferUseCase } from "@/modules/application/offers/deleteOfferUseCase"
import { getOffersUseCase } from "@/modules/application/offers/getOffersUseCase"
import { getOwnOffersUseCase } from "@/modules/application/offers/getOwnOffersUseCase"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { updateOfferAvailabilityUseCase } from "@/modules/application/offers/updateOfferAvailabilityUseCase"
import { updateOfferOfferDeletedAtUseCase } from "@/modules/application/offers/updateOfferDeletedAtUseCase"

export const makeCreateOfferUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (params: { boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[] | []; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; deletedAt?: Date | null }) => createOfferUseCase(offerRepository, params)
}

export const makeDeleteOfferUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (offerId: string) => deleteOfferUseCase(offerRepository, offerId)
}
export const makeGetOffersUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return () => getOffersUseCase(offerRepository)
}

export const makeGetOwnOffersUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return () => getOwnOffersUseCase(offerRepository)
}

export const makeGetSingleOfferUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (offerId: string) => getSingleOfferUseCase(offerRepository, offerId)
}

export const makeUpdateOfferAvailabilityUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (offerId: string, isAvailable: boolean) => updateOfferAvailabilityUseCase(offerRepository, offerId, isAvailable)
}

export const makeUpdateOfferDeletedAtUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (offerId: string, deletedAt: Date | null) => updateOfferOfferDeletedAtUseCase(offerRepository, offerId, deletedAt)
}

export const makeUpdateOfferUseCase = () => {
     const offerRepository = new OfferRepositorySupabase()
     return (params: { offerId: string; boatId: string; title: string; description: string; price: string; isAvailable: boolean; equipments: Equipment[]; isSkipperAvailable: boolean; isTeamAvailable: boolean; rentalPeriod: RentalPeriod; location: Location; isArchived?: boolean }) => updateOfferUseCase(offerRepository, params)
}
