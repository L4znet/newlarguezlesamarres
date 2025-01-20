import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { makeCreateBoatUseCase } from "@/modules/orchestration/BoatUseCaseFactory"
export function useCreateBoat() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const createBoat = makeCreateBoatUseCase()
     return useMutation({
          mutationFn: async (boat: any) => {
               await createBoat(boat)
          },
          onSuccess: (newBoat) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Boat added successfully!",
               })
               queryClient.invalidateQueries({ queryKey: ["boats"] })
               queryClient.invalidateQueries({ queryKey: ["canCreateOffer"] })
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
