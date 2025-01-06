import { create } from "zustand"
import { Equipment, Offer, RentalPeriod, Location } from "@/interfaces/Offer"
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

interface OfferStore {
     profileId: string | null
     equipments: Equipment[] | []
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
     boatId: string | null
     boatImages: BoatImage[]
     boat: Boat | null
     errors: Record<string, string[]>
     currentOffer: Offer | null
     temporaryLocation: Location
     temporaryBoatId: string | null
     temporaryEquipments: Equipment[]
     temporaryStartDate: Date | null
     temporaryEndDate: Date | null

     setEquipments: (equipments: Equipment[]) => void
     addEquipment: (equipment: Equipment) => void
     emptyEquipments: () => void
     removeEquipment: (index: number) => void
     setRentalPeriod: (start: string, end: string) => void
     setLocation: (location: Location) => void
     selectBoat: (boatUid: string | null) => void
     setOfferField: (fieldOrFields: keyof OfferStore | Partial<OfferStore>, value?: any) => void
     setErrors: (field: string, errors: string[]) => void
     getErrors: (field: string) => string[] | null
     clearErrors: (field?: string) => void
     setCurrentOffer: (offer: Promise<Partial<Offer>> | Partial<Offer>) => Promise<void>
     resetStore: () => void
     setTemporaryLocation: (location: Location) => void
     setTemporaryBoatId: (boatId: string) => void
     setTemporaryEquipments: (equipments: Equipment[]) => void
     setTemporaryStartDate: (start: Date | null) => void
     setTemporaryEndDate: (end: Date | null) => void
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
     boatId: null,
     boatImages: [],
     boat: null,
     currentOffer: null,
     errors: {},
     temporaryStartDate: null,
     temporaryEndDate: null,
     temporaryLocation: {
          city: "",
          country: "",
          address: "",
          zipcode: "",
     },
     temporaryBoatId: null,
     temporaryEquipments: [],

     setEquipments: (equipments) => set(() => ({ equipments })),
     addEquipment: (equipment) =>
          set((state) => ({
               equipments: [...state.equipments, equipment],
          })),
     removeEquipment: (index) =>
          set((state) => ({
               equipments: state.equipments.filter((_, i) => i !== index),
          })),
     emptyEquipments: () => set(() => ({ equipments: [] })),
     setRentalPeriod: (start: string, end: string) => set(() => ({ rentalPeriod: { start, end } })),
     setTemporaryStartDate: (start: Date | null) => set(() => ({ temporaryStartDate: start })),
     setTemporaryEndDate: (end: Date | null) => set(() => ({ temporaryEndDate: end })),

     setTemporaryLocation: (temporaryLocation) => set(() => ({ temporaryLocation })),
     setTemporaryBoatId: (boatId: string) => set(() => ({ selectedBoatId: boatId })),
     setTemporaryEquipments: (equipments) => set(() => ({ equipments })),
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
               price: "5",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               boatId: null,
               boatImages: [],
               boat: null,
               currentOffer: null,
               errors: {},
          })),
}))
