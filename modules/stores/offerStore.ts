import { create } from "zustand"
import { Equipment, Offer, RentalPeriod, Location } from "@/interfaces/Offer"
import { displayRentalFrequency, getFrequencyLabelByIndex, RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"

interface BoatImage {
     id: string
     url: string
     caption: string | null
     contentType: string
     dimensions: { width: number; height: number }
     size: number
     mimeType: string
     fileName: string
}

interface Boat {
     id: string
     profileId: string
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: BoatImage[]
}

interface Frequency {
     value: string
     list: {
          _id: RentalFrequency
          value: string
     }[]
     selectedList: {
          _id: RentalFrequency
          value: string
     }[]
     error: string
     id: RentalFrequency
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
     frequency: Frequency
     boatId: string | null
     boatImages: BoatImage[]
     boat: Boat | null
     errors: Record<string, string[]>
     currentOffer: Offer | null
     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: Location) => void
     setFrequency: (frequency: Frequency) => void
     selectBoat: (boatUid: string) => void
     setOfferField: (fieldOrFields: keyof OfferStore | Partial<OfferStore>, value?: any) => void
     setErrors: (field: string, errors: string[]) => void
     getErrors: (field: string) => string[] | null
     clearErrors: (field?: string) => void
     setCurrentOffer: (offer: Promise<Partial<Offer>> | Partial<Offer>) => Promise<void>
     resetStore: () => void
}

export const useOfferStore = create<OfferStore>((set, get) => ({
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
     price: "5",
     isAvailable: false,
     isSkipperAvailable: false,
     isTeamAvailable: false,
     frequency: {
          value: getFrequencyLabelByIndex(parseInt(RentalFrequency.Day.valueOf())) as string,
          list: [],
          selectedList: [],
          error: "",
          id: RentalFrequency.Day,
     },
     boatId: null,
     boatImages: [],
     boat: null,
     currentOffer: null,
     errors: {},

     setEquipments: (equipments) => set(() => ({ equipments })),
     addEquipment: (equipment) =>
          set((state) => ({
               equipments: [...state.equipments, equipment],
          })),
     removeEquipment: (index) =>
          set((state) => ({
               equipments: state.equipments.filter((_, i) => i !== index),
          })),
     setRentalPeriod: (start: string, end: string) => set(() => ({ rentalPeriod: { start, end } })),
     setLocation: (location) => set(() => ({ location })),
     selectBoat: (boatId) => set(() => ({ selectedBoatId: boatId })),
     setOfferField: (fieldOrFields, value) => {
          if (typeof fieldOrFields === "string") {
               set(() => ({ [fieldOrFields]: value }))
          } else {
               set((state) => ({ ...state, ...fieldOrFields }))
          }
     },
     setErrors: (field, errors) =>
          set((state) => ({
               errors: {
                    ...state.errors,
                    [field]: errors,
               },
          })),
     getErrors: (field) => {
          const state = get()
          return state.errors[field] || null
     },
     clearErrors: (field) =>
          set((state) => {
               if (field) {
                    const { [field]: _, ...rest } = state.errors
                    return { errors: rest }
               }
               return { errors: {} }
          }),
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
                    boatId: resolvedOffer.boatId ?? state.boatId ?? "",
                    rentalPeriod: resolvedOffer.rentalPeriod ?? state.rentalPeriod,
                    location: resolvedOffer.location ?? state.location,
                    equipments: resolvedOffer.equipments ?? state.equipments,
                    deletedAt: resolvedOffer.deletedAt ?? null,
                    frequency: resolvedOffer.frequency ?? state.frequency,
               },
          }))
     },
     setFrequency: (frequency) => set(() => ({ frequency })),
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
               price: "5",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               frequency: {
                    value: RentalFrequency.Day.valueOf(),
                    list: [],
                    selectedList: [],
                    error: "",
                    id: RentalFrequency.Day,
               },
               boatId: null,
               boatImages: [],
               boat: null,
               currentOffer: null,
               errors: {},
          })),
}))
