import { create } from "zustand"

interface Equipment {
     name: string
     quantity: string
}

interface OfferExternalScreenStore {
     equipments: Equipment[]
     rentalPeriod: { startDate: string | null; endDate: string | null }
     location: {
          city: string
          country: string
          address: string
          zipCode: string
     }
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (startDate: string, endDate: string) => void
     setLocation: (location: { country: string; zipCode: string; address: string; city: string }) => void
     resetStore: () => void
}

export const useOfferExternalScreenStore = create<OfferExternalScreenStore>((set) => ({
     equipments: [],
     rentalPeriod: { startDate: null, endDate: null },
     location: {
          city: "",
          country: "",
          address: "",
          zipCode: "",
     },

     setEquipments: (equipments) => set(() => ({ equipments })),
     addEquipment: (equipment) =>
          set((state) => ({
               equipments: [...state.equipments, equipment],
          })),
     removeEquipment: (index) =>
          set((state) => ({
               equipments: state.equipments.filter((_, i) => i !== index),
          })),
     setRentalPeriod: (startDate, endDate) => set(() => ({ rentalPeriod: { startDate, endDate } })),
     setLocation: (location) => set(() => ({ location })),
     resetStore: () => set(() => ({ equipments: [], rentalPeriod: { startDate: null, endDate: null }, location: null })),
}))
