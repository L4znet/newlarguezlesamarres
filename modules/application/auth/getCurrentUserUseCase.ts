import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"

export const getCurrentUserUseCase = async (): Promise<AuthEntity | null> => {
     const user = await authRepository.getCurrentUser()

     if (!user) {
          return null
     }

     return AuthEntity.fromSupabaseUser({ user: user.user })
}
