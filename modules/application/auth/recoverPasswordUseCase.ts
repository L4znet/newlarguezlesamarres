import authRepository from "@/modules/infrastructure/auth/AuthRepositorySupabase"
import * as Linking from "expo-linking"

export const recoverPasswordUseCase = async (email: string) => {
     const url = Linking.useURL()

     try {
          await authRepository.resetPassword(email, url)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
