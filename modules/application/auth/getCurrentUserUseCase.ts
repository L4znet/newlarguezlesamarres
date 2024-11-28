import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"

export const getCurrentUserUseCase = async () => {
     try {
          const user = await authRepository.getCurrentUser()

          return AuthEntity.fromSupabaseUser({
               userId: user.userId,
          })
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
