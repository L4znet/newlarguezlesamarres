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

interface CurrentBoat {
     id: string
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          id: string
          url: string
          boatId: string
          isDefault: boolean
          caption: string
          contentType: string
          base64: string
          dimensions: { width: number; height: number }
          size: string
          mimeType: string
          fileName: string
     }[]
}

interface BoatToUpdate {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          url: string
          boatId: string
          isDefault: boolean
          caption: string
          contentType: string
          base64: string
          dimensions: { width: number; height: number }
          size: string
          mimeType: string
          fileName: string
     }[]
}

interface BoatStore {
     currentBoatId: string | null
     isCurrentBoatLoading: boolean
     boatImages: any
     boatToUpdate: BoatToUpdate | null
     setCurrentBoatId: (boatId: string) => void
     setBoatToUpdate: (boat: BoatToUpdate) => void
     imageSelectedState: boolean
     setImageSelectedState: (state: boolean) => void
     setBoatImages: (images: any) => void
     setBoatField: (fieldOrFields: string | Partial<Boat>, value: any) => void
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
}

export const useBoatStore = create<BoatStore>((set) => ({
     currentBoatId: null,
     isCurrentBoatLoading: false,
     imageSelectedState: false,
     boatImages: [],
     boatToUpdate: null,
     boatName: "",
     boatDescription: "",
     boatCapacity: "",
     boatType: 0,
     setBoatToUpdate: (boat) => set({ boatToUpdate: boat }),

     setBoatField: (fieldOrFields, value) => {
          if (typeof fieldOrFields === "string") {
               set(() => ({ [fieldOrFields]: value }))
          } else {
               set((state) => ({ ...state, ...fieldOrFields }))
          }
     },

     setBoatImages: (images) => set({ boatImages: images }),

     setImageSelectedState: (state) => set({ imageSelectedState: state }),

     setCurrentBoatId: async (boatId) => {
          set({ isCurrentBoatLoading: true })

          set({ currentBoatId: boatId })

          set({ isCurrentBoatLoading: false })
     },
}))
