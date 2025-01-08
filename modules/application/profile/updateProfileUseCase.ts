import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { MessageType } from "react-native-flash-message"
import { ProfileUpdateSchema } from "@/modules/domain/profile/schemas/ProfileUpdateSchema"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"
import { router } from "expo-router"

export const updateProfileUseCase = async (lastname: string, firstname: string, username: string): Promise<ProfileEntity> => {
     try {
          const { user, error } = await AuthRepositorySupabase.updateProfile(lastname, firstname, username)

          return ProfileEntity.fromSupabaseUser({
               lastname: user.user_metadata?.lastname,
               firstname: user.user_metadata?.firstname,
               username: user.user_metadata?.username,
               email: user.email as string,
               avatar_url: user.user_metadata?.avatar_url,
          })
     } catch (error: unknown) {
          let errorMessage = "Une erreur inattendue est survenue."

          if (error instanceof Error) {
               errorMessage = error.message
          }

          throw new Error(errorMessage)
     }
}
