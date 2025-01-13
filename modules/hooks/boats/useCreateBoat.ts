import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
export function useCreateBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (boat: any) => {
               await createBoatUseCase(boat)
          },
          onSuccess: (newBoat) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat added successfully!",
               })

               queryClient.invalidateQueries({ queryKey: ["boats"] })
               queryClient.invalidateQueries({ queryKey: ["count_boats"] })
          },
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "An error occurred while adding the boat.",
               })

               console.error(error)
          },
     })
}
