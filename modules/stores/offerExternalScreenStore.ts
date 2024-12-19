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

     clearCurrentOffer: () => set(() => ({ currentOffer: null })),
}))
