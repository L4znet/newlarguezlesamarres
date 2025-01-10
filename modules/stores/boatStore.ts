import { create } from "zustand"

interface Boat {
     id: string
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: BoatImages[]
}

interface BoatImages {
     id?: string | null
     url: string
     boatId?: string
     isDefault: boolean
     caption: string | null
     contentType: string
     base64: string
     dimensions: { width: number; height: number }
     size: number
     mimeType: string
     fileName: string | null
}

interface BoatStore {
     currentBoat: Boat | null
     isCurrentBoatLoading: boolean
     setCurrentBoat: (boat: Boat | Promise<Boat>) => void
     updateCurrentBoatField: (field: keyof Boat, value: any) => void
     resetBoatStore: () => void
     boatImages: BoatImages[]
     setBoatImages: (images: BoatImages[]) => void
}

export const useBoatStore = create<BoatStore>((set) => ({
     currentBoat: null,
     isCurrentBoatLoading: false,
     boatImages: [] as BoatImages[],

     setBoatImages: (images) => set({ boatImages: images }),

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
