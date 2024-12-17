import supabase from "@/supabaseClient"
import { create } from "zustand"

export const useBoatStore = create<BoatStore>((set) => ({
     boats: [],
     isLoading: false,
     error: null,

     fetchBoats: async () => {
          set({ isLoading: true, error: null })
          try {
               const boats = await getBoatsUseCase()
               set({ boats, isLoading: false })
          } catch (error: any) {
               set({ error: error.message, isLoading: false })
          }
     },

     addBoat: (newBoat) => {
          set((state) => ({
               boats: [...state.boats, newBoat],
          }))
     },

     updateBoat: (updatedBoat) => {
          set((state) => ({
               boats: state.boats.map((boat) => (boat.boatId === updatedBoat.boatId ? updatedBoat : boat)),
          }))
     },

     deleteBoat: (boatId: string) => {
          set((state) => ({
               boats: state.boats.filter((boat) => boat.boatId !== boatId),
          }))
     },
}))

import { useEffect } from "react"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"

export const useRealtimeBoats = () => {
     const { addBoat, updateBoat, deleteBoat } = useBoatStore()

     useEffect(() => {
          const subscription = supabase
               .channel("boats-realtime")
               .on("postgres_changes", { event: "*", schema: "public", table: "boats" }, (payload) => {
                    if (payload.eventType === "INSERT") addBoat(payload.new)
                    if (payload.eventType === "UPDATE") updateBoat(payload.new)
                    if (payload.eventType === "DELETE") deleteBoat(payload.old.id)
               })
               .subscribe()

          return () => {
               supabase.removeChannel(subscription)
          }
     }, [])
}
