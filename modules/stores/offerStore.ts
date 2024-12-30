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

interface OfferStoreErrors {
     rentalPeriodErrors: string[]
     equipmentsErrors: string[]
     locationErrors: string[]
}

interface OfferStore {
     profileId: string | null
     equipments: Equipment[]
     rentalPeriod: RentalPeriod
     location: Location
     selectedBoatId: string | null
     id: string | null
     title: string
     description: string
     price: string
     isAvailable: boolean
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     frequency: number
     boatId: string | null
     boatImages: any[]
     boat: any | null
     errors: OfferStoreErrors
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: Location) => void
     selectBoat: (boatUid: string) => void
     setOfferField: (fieldOrFields: keyof OfferStore | Partial<OfferStore>, value?: any) => void
     setErrors: (section: string, errors: string[]) => void
     clearErrors: (section: string) => void
     getErrors: (section: string) => string[] | undefined
     resetStore: () => void
}

export const useOfferStore = create<OfferStore>((set, get) => ({
     profileId: null,
     equipments: [],
     rentalPeriod: { start: "", end: "" },
     location: { city: "", country: "", address: "", zipcode: "" },
     selectedBoatId: null,
     id: null,
     title: "",
     description: "",
     price: "0",
     isAvailable: false,
     isSkipperAvailable: false,
     isTeamAvailable: false,
     frequency: 0,
     boatId: null,
     boatImages: [],
     boat: null,
     errors: { rentalPeriodErrors: [], equipmentsErrors: [], locationErrors: [] },

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
     setOfferField: (fieldOrFields, value) => {
          if (typeof fieldOrFields === "string") {
               set(() => ({ [fieldOrFields]: value }))
          } else {
               set((state) => ({ ...state, ...fieldOrFields }))
          }
     },
     setErrors: (section, errors) =>
          set((state) => ({
               errors: { ...state.errors, [section]: errors },
          })),
     clearErrors: (section) =>
          set((state) => ({
               errors: { ...state.errors, [section]: undefined },
          })),
     getErrors: (section) => get().errors[section],
     resetStore: () =>
          set(() => ({
               profileId: null,
               equipments: [],
               rentalPeriod: { start: "", end: "" },
               location: { city: "", country: "", address: "", zipcode: "" },
               selectedBoatId: null,
               id: null,
               title: "",
               description: "",
               price: "0",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               frequency: 0,
               boatId: null,
               boatImages: [],
               boat: null,
               errors: { rentalPeriodErrors: [], equipmentsErrors: [], locationErrors: [] },
          })),
}))
