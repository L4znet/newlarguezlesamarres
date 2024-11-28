import { AuthResponse, createClient, SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js"
import dotenv from "dotenv"

require("dotenv").config()

const createSupaClient = (url: string, key: string, options: SupabaseClientOptions<"public"> = {}): SupabaseClient => {
     options.auth = options.auth || {}
     options.auth.persistSession = false

     return createClient(url, key, options)
}

const supabase = createSupaClient(process.env.EXPO_PUBLIC_SUPABASE_TEST_URL, process.env.EXPO_PUBLIC_SUPABASE_TEST_ANON_KEY)

const signUp = async (email: string, password: string, lastname: string | undefined, firstname: string | undefined, username: string | undefined, avatar_url?: string | undefined) => {
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

const signIn = async (email: string, password: string) => {
     const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })

     return { user, error }
}

export { createSupaClient, signUp, signIn }
