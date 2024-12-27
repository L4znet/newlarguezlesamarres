import { create } from "zustand"

interface Equipment {
     name: string
     quantity: string
}

interface RentalPeriod {
     start: string
     end: string
}

interface Location {
     city: string
     country: string
     address: string
     zipcode: string
}

interface OfferStore {
     profileId: string | null
     equipments: Equipment[]
     rentalPeriod: RentalPeriod
     location: Location
     selectedBoatId: string | null
     title: string
     description: string
     price: string
     isAvailable: boolean
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     frequency: number
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: Location) => void
     selectBoat: (boatUid: string) => void
     setOfferField: (field: keyof OfferStore, value: any) => void
     resetStore: () => void
}

export const useOfferStore = create<OfferStore>((set) => ({
     profileId: null,
     equipments: [],
     rentalPeriod: { start: "", end: "" },
     location: {
          city: "",
          country: "",
          address: "",
          zipcode: "",
     },
     selectedBoatId: null,
     title: "",
     description: "",
     price: "0",
     isAvailable: false,
     isSkipperAvailable: false,
     isTeamAvailable: false,
     frequency: 0,

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
     setOfferField: (field, value) => set(() => ({ [field]: value })),
     resetStore: () =>
          set(() => ({
               profileId: null,
               equipments: [],
               rentalPeriod: { start: "", end: "" },
               location: {
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               },
               selectedBoatId: null,
               title: "",
               description: "",
               price: "0",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               frequency: 0,
          })),
}))
