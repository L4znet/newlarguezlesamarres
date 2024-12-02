import AuthRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { User } from "@supabase/auth-js"

export const getCurrentUserUseCase = async () => {
     try {
          const user = (await AuthRepository.getCurrentUser()) as { user: User }

          return AuthEntity.fromSupabaseUser({ user: user.user })
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
