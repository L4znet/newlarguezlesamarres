import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"

export const getProfileUseCase = async () => {
     try {
          const user: unknown = await authRepository.getCurrentUser()

          return new AuthEntity(email)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
