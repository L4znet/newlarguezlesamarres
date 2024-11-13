import { supabase } from "../supabaseClient"

export const loginUseCase = async (email, password) => {
     const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
     })
     if (error) throw error
     return data.user
}
