import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { makeDeleteBoatUseCase } from "@/modules/orchestration/BoatUseCaseFactory"

export function useDeleteBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     const deleteBoat = makeDeleteBoatUseCase()

     return useMutation({
          mutationFn: async (boatId: string) => {
               await deleteBoat(boatId)
          },
          onSuccess: () => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat deleted successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["boats"] })
               queryClient.invalidateQueries({ queryKey: ["count_boats"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
