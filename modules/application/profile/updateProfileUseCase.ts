import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { MessageType } from "react-native-flash-message"
import { ProfileUpdateSchema } from "@/modules/domain/profile/schemas/ProfileUpdateSchema"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export const updateProfileUseCase = async (
     data: {
          firstname: string
          lastname: string
          username: string
          email: string
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
     const parsedData = ProfileUpdateSchema.safeParse(data)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")

          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })

          return
     }

     const { firstname, lastname, username, email } = parsedData.data

     try {
          const { user, error } = await AuthRepositorySupabase.updateProfile(lastname, firstname, username, email)

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error,
               })
               throw new Error(error)
          }
          if (user !== null && user?.user?.id) {
               return ProfileEntity.fromSupabaseUser({
                    profile: {
                         lastname: user.user.user_metadata.lastname,
                         firstname: user.user.user_metadata.firstname,
                         username: user.user.user_metadata.username,
                         email: user?.user?.email || "",
                    },
               })
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
