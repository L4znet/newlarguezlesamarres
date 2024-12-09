import React, { createContext, useContext, useEffect, useState } from "react"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { useSession } from "@/modules/context/SessionProvider"
import { router } from "expo-router"
import supabase from "@/supabaseClient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Session, UserMetadata } from "@supabase/supabase-js"
import { User } from "@supabase/auth-js"

type AuthContextType = {
     signUp: (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
     session: Session | null
     user: User | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const [session, setSession] = useState<Session | null>(null)
     const [user, setUser] = useState<UserMetadata | null>(null)

     const signUp = async (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => {
          try {
               const newUser = await signupUseCase({ email, password, confirmPassword, firstname, lastname, username }, showTranslatedFlashMessage)
               if (newUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User successfully registered" })
                    router.push("/(app)/(auth)/signin")
               }
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     const signIn = async (email: string, password: string) => {
          try {
               const loggedInUser = await loginUseCase({ email, password }, showTranslatedFlashMessage)
               if (loggedInUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged in successfully" })
               }
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     const signOut = async () => {
          try {
               await logoutUseCase()
               await AsyncStorage.removeItem("supabase_session")
               setSession(null)
               setUser(null)
               showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged out successfully" })
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     useEffect(() => {
          const getSession = async () => {
               const storedSession = await AsyncStorage.getItem("supabase_session")
               if (storedSession) {
                    const parsedSession = JSON.parse(storedSession)
                    setSession(parsedSession)
                    setUser(parsedSession.user.user_metadata)
               }
          }

          getSession()

          const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
               if (newSession) {
                    await AsyncStorage.setItem("supabase_session", JSON.stringify(newSession))
                    setSession(newSession)
                    console.log(newSession.user)
                    setUser(newSession.user.user_metadata)
               } else {
                    await AsyncStorage.removeItem("supabase_session")
                    setSession(null)
                    setUser(null)
               }
          })

          return () => {
               subscription.subscription?.unsubscribe()
          }
     }, [])

     return <AuthContext.Provider value={{ signUp, signIn, signOut, session, user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) {
          throw new Error("useAuth must be used within an AuthProvider")
     }
     return context
}
