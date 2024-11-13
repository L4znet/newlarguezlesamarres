// domain/auth/AuthRepository.ts
import { AuthEntity } from "./AuthEntity"

export interface AuthRepository {
     signUp(email: string, password: string): Promise<AuthEntity>
     signIn(email: string, password: string): Promise<AuthEntity>
     signOut(): Promise<void>
     getCurrentUser(): Promise<AuthEntity | null>
}
