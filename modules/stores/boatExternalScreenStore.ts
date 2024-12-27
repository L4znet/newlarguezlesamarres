import { create } from "zustand"

interface Boat {
     id: string
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: any[]
}

interface BoatStore {
     currentBoat: Boat | null
     isCurrentBoatLoading: boolean
     setCurrentBoat: (boat: Boat | Promise<Boat>) => void
     updateCurrentBoatField: (field: keyof Boat, value: any) => void
     resetCurrentBoat: () => void
}

export const useBoatStore = create<BoatStore>((set) => ({
     currentBoat: null,
     isCurrentBoatLoading: false,

     setCurrentBoat: async (boat) => {
          set({ isCurrentBoatLoading: true })
          const resolvedBoat = boat instanceof Promise ? await boat : boat
          set({ currentBoat: resolvedBoat, isCurrentBoatLoading: false })
     },

     updateCurrentBoatField: (field, value) =>
          set((state) => ({
               currentBoat: state.currentBoat ? { ...state.currentBoat, [field]: value } : null,
          })),

     resetCurrentBoat: () => set({ currentBoat: null, isCurrentBoatLoading: false }),
}))
