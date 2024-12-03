import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { MessageType } from "react-native-flash-message"
import { EmailUpdateSchema } from "@/modules/domain/profile/schemas/EmailUpdateSchema"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"
import EmailUpdateEntity from "@/modules/domain/profile/EmailUpdateEntity"

export const updateEmailUseCase = async (
     data: {
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
): Promise<EmailUpdateEntity | undefined> => {
     const parsedData = EmailUpdateSchema.safeParse(data)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })
          throw new Error(errorMessages)
     }

     const { email } = parsedData.data

     try {
          const updatedEmail = await AuthRepositorySupabase.updateEmail(email)

          const { updatedUser, error } = updatedEmail

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error,
               })
               throw new Error(error)
          }

          if (updatedUser.user) {
               return EmailUpdateEntity.fromSupabaseUser({
                    email: updatedUser.user.email,
               })
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
