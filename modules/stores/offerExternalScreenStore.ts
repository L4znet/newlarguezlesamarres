import { create } from "zustand"

interface Equipment {
     name: string
     quantity: string
}

interface RentalPeriod {
     startDate: string | null
     endDate: string | null
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
     setRentalPeriod: (startDate: string, endDate: string) => void
     setLocation: (location: { zipcode: string; country: string; address: string; city: string }) => void
     selectBoat: (boatUid: string) => void
     resetStore: () => void
}

export const useOfferExternalScreenStore = create<OfferExternalScreenStore>((set) => ({
     equipments: [],
     rentalPeriod: { startDate: null, endDate: null },
     location: {
          city: "",
          country: "",
          address: "",
          zipcode: "",
     },
     selectedBoatId: null,

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
     selectBoat: (boatId) => set(() => ({ selectedBoatId: boatId })),
     resetStore: () =>
          set(() => ({
               equipments: [],
               rentalPeriod: { startDate: null, endDate: null },
               location: {
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               },
               selectedBoatId: null,
          })),
}))