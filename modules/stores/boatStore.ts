import { create } from "zustand"

interface Boat {
     id: string
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          id?: string | null
          url: string
          boatId?: string
          isDefault: boolean
          caption: string | null
          contentType: string
          base64: string
          dimensions: { width: number; height: number }
          size: string
          mimeType: string
          fileName: string | null
     }[]
}

interface BoatStore {
     currentBoat: Boat | null
     isCurrentBoatLoading: boolean
     boatImages: any
     setCurrentBoat: (boat: Boat | Promise<Boat>) => void
     updateCurrentBoatField: (field: keyof Boat, value: any) => void
     resetBoatStore: () => void
     imageSelectedState: boolean
     setImageSelectedState: (state: boolean) => void
     setBoatImages: (images: any) => void
}

export const useBoatStore = create<BoatStore>((set) => ({
     currentBoat: null,
     isCurrentBoatLoading: false,
     imageSelectedState: false,
     boatImages: [],

     setBoatImages: (images) => set({ ...images }),

     setImageSelectedState: (state) => set({ imageSelectedState: state }),

     setCurrentBoat: async (boat) => {
          set({ isCurrentBoatLoading: true })
          const resolvedBoat = boat instanceof Promise ? await boat : boat
          set({ currentBoat: resolvedBoat, isCurrentBoatLoading: false })
     },

     updateCurrentBoatField: (field, value) =>
          set((state) => ({
               currentBoat: state.currentBoat ? { ...state.currentBoat, [field]: value } : null,
          })),

     resetBoatStore: () => set({ currentBoat: null, isCurrentBoatLoading: false }),
}))
