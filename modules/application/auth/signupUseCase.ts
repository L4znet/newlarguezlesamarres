import { supabase } from "@/modules/utils/api"

export const signupUseCase = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signUp({
          email,
          password,
     })
     if (error) throw error
     return data.user
}
