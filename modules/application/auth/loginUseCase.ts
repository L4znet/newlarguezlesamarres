import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { MessageType } from "react-native-flash-message"
import { UserConnectionSchema } from "@/modules/domain/auth/schemas/UserConnectionSchema"

export const loginUseCase = async (
     userCredentials: {
          email: string
          password: string
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
     const parsedData = UserConnectionSchema.safeParse(userCredentials)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")

          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })

          return
     }

     const { email } = parsedData.data

     try {
          const { user, error } = await AuthRepositorySupabase.signIn(email, userCredentials.password)

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error.message,
               })
               throw new Error(error.message)
          }

          if (user !== null && user?.user) {
               return AuthEntity.fromSupabaseUser({ user: user.user })
          } else {
               return null
          }
     } catch (error: any) {
          console.dir(error)
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: error.message || "Une erreur inattendue est survenue.",
          })
          throw new Error(error.message)
     }
}
