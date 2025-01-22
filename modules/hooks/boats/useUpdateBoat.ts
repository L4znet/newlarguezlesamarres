import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBoatUseCase } from "@/modules/application/boats/updateBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useBoatStore } from "@/modules/stores/boatStore"
import { makeUpdateBoatUseCase } from "@/modules/orchestration/BoatUseCaseFactory"

export function useUpdateBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { boatImages, setBoatImages } = useBoatStore()

     const updateBoat = makeUpdateBoatUseCase()
     return useMutation({
          mutationFn: async ({ boatId, updatedData, imageSelected }: { boatId: string; updatedData: any; imageSelected: boolean }) => {
               await updateBoat(boatId, updatedData, imageSelected)
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["boats"] })
               queryClient.invalidateQueries({ queryKey: ["boat"] })
               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
               setBoatImages([])
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat updated successfully!",
               })
          },

          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
