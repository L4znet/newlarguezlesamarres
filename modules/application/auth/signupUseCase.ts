import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { UserRegistrationSchema } from "../../domain/auth/schemas/UserRegistrationSchema"
import { MessageType } from "react-native-flash-message"

export const signupUseCase = async (data: { email: string; password: string; firstname: string; lastname: string; username: string; confirmPassword: string; avatar_url?: string }) => {
     const newData = { ...data, avatar_url: data.avatar_url || "assets/images/default-avatar.png" }

     const { email, password, firstname, lastname, username } = data

     try {
          const { user, error } = await AuthRepositorySupabase.signUp(email, password, lastname, firstname, username)

          if (user !== null && user?.user?.id) {
               return AuthEntity.fromSupabaseUser({ user: user.user })
          } else {
               return null
          }
     } catch (error: any) {
          throw new Error(error.message)
     }
}
