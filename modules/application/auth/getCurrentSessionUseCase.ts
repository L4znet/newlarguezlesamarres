import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import { AuthError, Session } from "@supabase/supabase-js"

export const getCurrentSessionUseCase = async (): Promise<{ data: { session: Session }; error: null } | { data: { session: null }; error: AuthError } | { data: { session: null }; error: null }> => {
     return await authRepository.getCurrentSession()
}
