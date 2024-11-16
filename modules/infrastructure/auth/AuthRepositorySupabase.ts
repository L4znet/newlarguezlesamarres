// AuthRepositorySupabase.ts - Implementation of AuthRepository
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js"
import AuthRepository from "../../domain/auth/AuthRepository"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)
interface Profile {
     firstname: string
     lastname: string
     username: string
     email: string
}

class AuthRepositorySupabase implements AuthRepository {
     async signUp(email: string, password: string, lastname: string, firstname: string, username: string) {
          const { data: user, error } = await supabase.auth.signUp({ email, password })
          if (error) {
               throw new Error(error.message)
          }

          const { error: profileError } = await this.updateProfile(lastname, firstname, username)

          if (profileError) {
               throw new Error(profileError.message)
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
          if (userError || !user) {
               throw new Error("No user is currently logged in")
          }

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

     async getSession() {
          return supabase.auth.getSession()
     }

     async updateProfile(lastname: string, firstname: string, username: string) {
          const { data, error } = await supabase.from("profiles").upsert({ lastname, firstname, username })
          return { data, error }
     }
}

export default new AuthRepositorySupabase()
