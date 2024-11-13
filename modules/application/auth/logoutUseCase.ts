import { supabase } from "@/modules/utils/api"

export const logoutUseCase = async () => {
     const { error } = await supabase.auth.signOut()
     if (error) throw error
}
