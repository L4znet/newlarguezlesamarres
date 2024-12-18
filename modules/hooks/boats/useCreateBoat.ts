import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useCreateBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (boat: Boat) => {
               await createBoatUseCase(boat, showTranslatedFlashMessage)
          },
          onSuccess: (newBoat) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat added successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["boats"] })
          },
     })
}
