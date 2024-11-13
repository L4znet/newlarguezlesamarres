import { AuthRepository } from "../../domain/auth/AuthRepository"
import { AuthEntity } from "../../domain/auth/AuthEntity"

export class AuthRepositorySupabase implements AuthRepository {
     async signUp(email: string, password: string): Promise<AuthEntity> {
          const { data, error } = await supabase.auth.signUp({ email, password })
          if (error || !data.user) throw new Error(error.message)
          return new AuthEntity(data.user.id, data.user.email)
     }

     async signIn(email: string, password: string): Promise<AuthEntity> {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error || !data.user) throw new Error(error.message)
          return new AuthEntity(data.user.id, data.user.email)
     }

     async signOut(): Promise<void> {
          const { error } = await supabase.auth.signOut()
          if (error) throw new Error(error.message)
     }

     async getCurrentUser(): Promise<AuthEntity | null> {
          const user = supabase.auth.getUser()
          return user ? new AuthEntity(user.id, user.email) : null
     }
}
