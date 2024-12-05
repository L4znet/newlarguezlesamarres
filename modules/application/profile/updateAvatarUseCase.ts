import ProfileEntity from "@/modules/domain/profile/ProfileEntity"
import { MessageType } from "react-native-flash-message"
import { ProfileUpdateSchema } from "@/modules/domain/profile/schemas/ProfileUpdateSchema"
import AuthRepositorySupabase from "@/modules/infrastructure/auth/AuthRepositorySupabase"
import { AvatarUpdateSchema } from "@/modules/domain/profile/schemas/AvatarUpdateSchema"
import AvatarUpdateEntity from "@/modules/domain/profile/AvatarUpdateEntity"

export const updateAvatarUseCase = async (
     data: {
          avatar: string
     },
     showTranslatedFlashMessage: (
          type: MessageType,
          messageOrMessages:
               | {
                      title: string
                      description: string
                 }
               | Array<{ title: string; description: string }>,
          locale?: string
     ) => void
): Promise<AvatarUpdateEntity> => {
     const parsedData = AvatarUpdateSchema.safeParse(data)

     if (!parsedData.success) {
          const errorMessages = parsedData.error.errors.map((err) => err.message).join("\n")
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: errorMessages,
          })
          throw new Error(errorMessages)
     }

     const { avatar } = parsedData.data

     try {
          const { user, error } = await AuthRepositorySupabase.updateAvatar(avatar)

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: error,
               })
               throw new Error(error)
          }

          if (user && user.id) {
               return AvatarUpdateEntity.fromSupabaseUser({
                    avatar: user.user_metadata?.avatar,
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
