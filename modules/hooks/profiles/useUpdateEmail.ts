import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBoatUseCase } from "@/modules/application/boats/updateBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { updateEmailUseCase } from "@/modules/application/profile/updateEmailUseCase"

export function useUpdateEmail() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async (email: string) => {
               await updateEmailUseCase(email)
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["profile"] })
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "Email updated successfully!",
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
