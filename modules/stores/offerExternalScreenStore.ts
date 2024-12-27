import { create } from "zustand"
import { Offer } from "@/interfaces/Offer"

interface Equipment {
     name: string
     quantity: string
}

interface RentalPeriod {
     start: string | null
     end: string | null
}

interface Location {
     city: string
     country: string
     address: string
     zipcode: string
}

interface OfferExternalScreenStore {
     equipments: Equipment[]
     rentalPeriod: RentalPeriod
     location: Location
     selectedBoatId: string | null
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: { zipcode: string; country: string; address: string; city: string }) => void
     selectBoat: (boatUid: string) => void
     resetStore: () => void
     currentOffer: Offer | null
     setCurrentOffer: (offer: Offer) => void
     updateCurrentOffer: (updatedData: Partial<Offer>) => void
     clearCurrentOffer: () => void
     setCurrentOfferToRent: (offer: { isAvailable: boolean; amount: string; rentalPeriod: RentalPeriod; description: string; title: string; frequency: number; equipments: Equipment[] | []; deletedAt: Date | null; profileId?: string; price: string; isTeamAvailable: boolean; location: Location; id?: string; boatId: string; isSkipperAvailable: boolean }) => void
     currentOfferToRent: Offer | null
     updateBoatImagesInOffer: (boatId: string, newImages: string[]) => void
}
export const useOfferExternalScreenStore = create<OfferExternalScreenStore>((set) => ({
     equipments: [],
     rentalPeriod: { start: null, end: null },
     location: {
          city: "",
          country: "",
          address: "",
          zipcode: "",
     },
     selectedBoatId: null,
     currentOffer: null,
     currentOfferToRent: null,

     setEquipments: (equipments) => set(() => ({ equipments })),
     addEquipment: (equipment) =>
          set((state) => ({
               equipments: [...state.equipments, equipment],
          })),
     removeEquipment: (index) =>
          set((state) => ({
               equipments: state.equipments.filter((_, i) => i !== index),
          })),
     setRentalPeriod: (start, end) => set(() => ({ rentalPeriod: { start, end } })),
     setLocation: (location) => set(() => ({ location })),
     selectBoat: (boatId) => set(() => ({ selectedBoatId: boatId })),
     resetStore: () =>
          set(() => ({
               equipments: [],
               rentalPeriod: { start: null, end: null },
               location: {
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               },
               selectedBoatId: null,
          })),
     setCurrentOffer: (offer) => set(() => ({ currentOffer: offer })),
     updateCurrentOffer: (updatedData) =>
          set((state) => ({
               currentOffer: state.currentOffer ? { ...state.currentOffer, ...updatedData } : null,
          })),
     setCurrentOfferToRent: (offer) =>
          set(() => ({
               currentOfferToRent: {
                    ...offer,
                    rentalPeriod: {
                         ...offer.rentalPeriod,
                         start: offer.rentalPeriod.start || "",
                         end: offer.rentalPeriod.end || "",
                    },
               },
          })),

     clearCurrentOffer: () => set(() => ({ currentOffer: null })),

     updateBoatImagesInOffer: (boatId, newImages) =>
          set((state) => ({
               currentOffer: state.currentOffer && state.currentOffer.boatId === boatId ? { ...state.currentOffer, boatImages: newImages } : state.currentOffer,
               currentOfferToRent: state.currentOfferToRent && state.currentOfferToRent.boatId === boatId ? { ...state.currentOfferToRent, boatImages: newImages } : state.currentOfferToRent,
          })),
}))
