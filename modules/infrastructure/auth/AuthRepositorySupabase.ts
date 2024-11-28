import { createClient, PostgrestSingleResponse, AuthError, AuthChangeEvent, Session } from "@supabase/supabase-js"
import AuthRepository from "../../domain/auth/AuthRepository"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
     userId: string
}

class AuthRepositorySupabase implements AuthRepository {
     async signUp(email: string, password: string, lastname: string, firstname: string, username: string, avatar_url?: string) {
          try {
               const { data: user, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                         data: {
                              firstname,
                              lastname,
                              username,
                              email,
                              avatar_url,
                         },
                    },
               })

               if (error) {
                    throw new Error(error.message)
               }

               return { user, error }
          } catch (error: unknown) {
               if (error instanceof Error) {
                    throw error
               } else {
                    throw new Error("Une erreur inattendue est survenue.")
               }
          }
     }

     async signIn(email: string, password: string) {
          try {
               const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })

               return { user, error }
          } catch (error: unknown) {
               if (error instanceof Error) {
                    throw error
               } else {
                    throw new Error("Une erreur inattendue est survenue.")
               }
          }
     }

     async signOut() {
          const { error } = await supabase.auth.signOut()
          if (error) {
               throw new Error(`Erreur lors de la déconnexion : ${error.message}`)
          }
     }

     async getCurrentUser() {
          return new Promise((resolve, reject) => {
               const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
                    if (session?.user) {
                         resolve({
                              userId: session.user.id,
                         })
                    } else {
                         reject(new Error("Erreur lors de la récupération de l'utilisateur courant."))
                    }
               })

               return () => {
                    subscription.subscription.unsubscribe()
               }
          })
     }

     async resetPassword(email: string) {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) {
               throw new Error(`Erreur lors de la réinitialisation du mot de passe : ${error.message}`)
          }
     }

     async updateProfile(lastname: string, firstname: string, username: string) {
          const { data: user, error: userError } = await supabase.auth.getUser()
          if (userError || !user) {
               throw new Error("Problème lors de la récupération de l'utilisateur courant.")
          }

          const { error } = await supabase.from("profiles").upsert({ lastname, firstname, username })

          if (error) {
               throw new Error(`Erreur lors de la mise à jour du profil : ${error.message}`)
          }
     }

     onAuthStateChanged(callback: (session: Session | null) => void) {
          const { data: subscription } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
               callback(session)
          })

          return () => {
               subscription.subscription?.unsubscribe()
          }
     }
}

export default new AuthRepositorySupabase()
