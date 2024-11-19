import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"

export const getCurrentUserUseCase = async () => {
     try {
          const user = await authRepository.getCurrentUser()

          return AuthEntity.fromSupabaseUser({
               lastname: user.lastname,
               firstname: user.firstname,
               username: user.username,
               email: user.email,
          })
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
