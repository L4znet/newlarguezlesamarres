import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { router } from "expo-router"

export function useSignup() {
     const queryClient = useQueryClient()
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useMutation({
          mutationFn: async ({ lastname, firstname, username, email, password, confirmPassword }: { lastname: string; firstname: string; username: string; email: string; password: string; confirmPassword: string }) => {
               await signupUseCase({
                    lastname,
                    firstname,
                    username,
                    email,
                    password,
                    confirmPassword,
               })
          },
          onSuccess: (newUser) => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "User successfully registered",
               })
               queryClient.invalidateQueries({ queryKey: ["profile"] })
               router.navigate("/(app)/(auth)/signin")
               return newUser
          },
     })
}
