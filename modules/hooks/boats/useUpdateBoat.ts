import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBoatUseCase } from "@/modules/application/boats/updateBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useUpdateBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ boatId, updatedData, imageSelected }: { boatId: string; updatedData: any; imageSelected: boolean }) => {
               await updateBoatUseCase(boatId, updatedData, imageSelected)
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["boats"] })
               queryClient.invalidateQueries({ queryKey: ["offers"] })
               queryClient.invalidateQueries({ queryKey: ["ownOffers"] })
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat updated successfully!",
               })
          },

          onError: (error) => {
               console.log("error", error)

               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
