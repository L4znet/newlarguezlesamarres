// AuthRepositorySupabase.ts - Implementation of AuthRepository
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js"
import AuthRepository from "../../domain/auth/AuthRepository"
import { mapMessage } from "@/modules/utils/messageMapper"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)
interface Profile {
     firstname: string
     lastname: string
     username: string
     email: string
     user_id: string
}

class AuthRepositorySupabase implements AuthRepository {
     async signUp(email: string, password: string, lastname: string, firstname: string, username: string) {
          const { data: user, error: errorAuth } = await supabase.auth.signUp({ email, password })

          if (errorAuth) {
               throw new Error(mapMessage(errorAuth.message))
          }
          return user
     }

     async signIn(email: string, password: string) {
          const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) {
               throw new Error(error.message)
          }
          return user
     }

     async signOut() {
          const { error } = await supabase.auth.signOut()
          if (error) {
               throw new Error(error.message)
          }
     }

     async getCurrentUser() {
          const { data: user, error: userError } = await supabase.auth.getUser()

          const { data: profile, error: profileError }: PostgrestSingleResponse<Profile> = await supabase.from("profiles").select("*").eq("user_id", user.user.id).single()

          if (profileError) {
               throw new Error(profileError.message)
          }

          return { firstname: profile.firstname, lastname: profile.lastname, username: profile.username, email: user.user.email }
     }

     async resetPassword(email: string) {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) {
               throw new Error(error.message)
          }
     }

     async updateProfile(user_id: string, lastname: string, firstname: string, username: string) {
          const { data: user, error: userError } = await supabase.auth.getUser()
          if (userError || !user) {
               throw new Error("Problème lors de la récupération de l'utilisateur")
          }

          const { error } = await supabase.from("profiles").upsert({ user_id, lastname, firstname, username })
          if (error) {
               throw new Error(error.message)
          }
     }
}

export default new AuthRepositorySupabase()
