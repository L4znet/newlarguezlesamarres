import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"

export const logoutUseCase = async () => {
     try {
          await authRepository.signOut()
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
