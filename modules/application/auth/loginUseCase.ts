import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"

export const loginUseCase = async (email: string, password: string) => {
     interface Error {
          message: string
          code: string
     }

     try {
          const user = await authRepository.signIn(email, password)
          return AuthEntity.fromSupabaseUser(user)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
