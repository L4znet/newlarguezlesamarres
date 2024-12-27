import { create } from "zustand"
import { Offer } from "@/interfaces/Offer"

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
     id: string | null
     title: string
     description: string
     price: string
     isAvailable: boolean
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     frequency: number
     boatId: string | null
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: Location) => void
     selectBoat: (boatUid: string) => void
     setOfferField: (field: keyof OfferStore, value: any) => void
     setCurrentOffer: (offer: Promise<Partial<Offer>> | Partial<Offer>) => Promise<void>
     resetStore: () => void
     currentOffer: Offer | null
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
     id: null,
     title: "",
     description: "",
     price: "0",
     isAvailable: false,
     isSkipperAvailable: false,
     isTeamAvailable: false,
     frequency: 0,
     boatId: null,
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
     setOfferField: (field, value) => set(() => ({ [field]: value })),

     setCurrentOffer: async (offer) => {
          const resolvedOffer = offer instanceof Promise ? await offer : offer

          set((state) => ({
               ...state,
               currentOffer: {
                    id: resolvedOffer.id ?? state.id ?? "",
                    profileId: resolvedOffer.profileId ?? state.profileId ?? null,
                    title: resolvedOffer.title ?? state.title,
                    description: resolvedOffer.description ?? state.description,
                    price: resolvedOffer.price ?? state.price,
                    isAvailable: resolvedOffer.isAvailable ?? state.isAvailable,
                    isSkipperAvailable: resolvedOffer.isSkipperAvailable ?? state.isSkipperAvailable,
                    isTeamAvailable: resolvedOffer.isTeamAvailable ?? state.isTeamAvailable,
                    frequency: resolvedOffer.frequency ?? state.frequency,
                    boatId: resolvedOffer.boatId ?? state.boatId ?? "",
                    rentalPeriod: resolvedOffer.rentalPeriod ?? state.rentalPeriod,
                    location: resolvedOffer.location ?? state.location,
                    equipments: resolvedOffer.equipments ?? state.equipments,
                    deletedAt: resolvedOffer.deletedAt ?? null,
               },
          }))
     },

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
               id: null,
               title: "",
               description: "",
               price: "0",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               frequency: 0,
               boatId: null,
               currentOffer: null,
          })),
}))
