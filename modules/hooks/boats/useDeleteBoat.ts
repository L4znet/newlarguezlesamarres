import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useDeleteBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (boatId: string) => {
               await deleteBoatUseCase(boatId, showTranslatedFlashMessage)
          },
          onSuccess: () => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat deleted successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["boats"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: (error as Error).message,
               })
          },
     })
}
