// signupUseCase.ts
import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { UserRegistrationSchema } from "../../domain/auth/schemas/UserRegistrationSchema"
import { MessageType } from "react-native-flash-message"

export const signupUseCase = async (
     data: { email: string; password: string; firstname: string; lastname: string; username: string; confirmPassword: string },
     showTranslatedFlashMessage: (
          type: MessageType,
          message: {
               title: string
               description: string
          },
          locale?: string
     ) => void
) => {
     type UserRegistration = {
          email: string
          password: string
          firstname: string
          lastname: string
          username: string
     }

     const parsedData = UserRegistrationSchema.safeParse({
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
          confirmPassword: data.confirmPassword,
     })

     if (!parsedData.success) {
          showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: parsedData.error.message })
     }

     const { email, password, firstname, lastname, username } = parsedData.data as UserRegistration

     try {
          const user = await authRepository.signUp(email, password, firstname, lastname, username)
          return AuthEntity.fromSupabaseUser(user)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
