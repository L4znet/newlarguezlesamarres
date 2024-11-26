import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { UserRegistrationSchema } from "../../domain/auth/schemas/UserRegistrationSchema"
import { MessageType } from "react-native-flash-message"

export const signupUseCase = async (
     data: {
          email: string
          password: string
          firstname: string
          lastname: string
          username: string
          confirmPassword: string
          avatar_url?: string
     },
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     const parsedData = UserRegistrationSchema.safeParse(data)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")

          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })

          return
     }

     const { email, password, firstname, lastname, username, avatar_url } = parsedData.data

     try {
          const { user, error } = await AuthRepositorySupabase.signUp(email, password, firstname, lastname, username, avatar_url)

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error,
               })
               throw new Error(error)
          }

          return AuthEntity.fromSupabaseUser(user)
     } catch (error: unknown) {
          let errorMessage = "Une erreur inattendue est survenue."

          if (error instanceof Error) {
               errorMessage = error.message
          }

          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessage,
          })

          throw new Error(errorMessage)
     }
}
