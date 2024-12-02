import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { MessageType } from "react-native-flash-message"
import { UserUpdateSchema } from "@/modules/domain/auth/schemas/UserUpdateSchema"

export const updateProfileUseCase = async (
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
     const parsedData = UserUpdateSchema.safeParse(data)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")

          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })

          return
     }

     const { firstname, lastname, username } = parsedData.data

     try {
          const { user, error } = await AuthRepositorySupabase.updateProfile(lastname, firstname, username)

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error,
               })
               throw new Error(error)
          }
          if (user !== null && user?.user?.id) {
               return AuthEntity.fromSupabaseUser({ user: user.user })
          } else {
               return null
          }
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
