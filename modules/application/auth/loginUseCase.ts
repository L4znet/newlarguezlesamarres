import { supabase } from "@/modules/utils/api"

export const loginUseCase = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
     })
     if (error) throw error
     return data.user
}
