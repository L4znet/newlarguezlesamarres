import React, { createContext, useContext, useEffect, useState } from "react"
import AuthEntity from "../domain/auth/AuthEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import supabase from "@/supabaseClient"
type Session = {
     userId: string
}

type AuthContextType = {
     signUp: (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
     setSession: (session: Session | null) => void
     session: Session | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [user, setUser] = useState<AuthEntity | null>(null)
     const { showTranslatedFlashMessage } = useFlashMessage()
     const [session, setSession] = useState<Session | null>(null)

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
                    setSession({
                         userId: loggedInUser.user.user.id,
                    })
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged in successfully" })
               }
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     const signOut = async () => {
          try {
               await logoutUseCase()
               setSession(null)
               showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged out successfully" })
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     const loadSession = async () => {
          try {
               const savedSession = await AsyncStorage.getItem("session")
               if (savedSession) {
                    const parsedSession = JSON.parse(savedSession)
                    setSession(parsedSession)
               }
          } catch (error) {
               console.error("Failed to load session:", error)
          }
     }

     const saveSession = async (session: Session | null) => {
          if (session) {
               await AsyncStorage.setItem("session", JSON.stringify(session))
          } else {
               await AsyncStorage.removeItem("session")
          }
     }

     useEffect(() => {
          loadSession()

          const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
               const updatedSession = session?.user.id ? { userId: session.user.id } : null
               setSession(updatedSession)
               saveSession(updatedSession)
          })

          return () => {
               subscription.subscription?.unsubscribe()
          }
     }, [])

     return <AuthContext.Provider value={{ signUp, signIn, signOut, session, setSession }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) {
          throw new Error("useAuth must be used within an AuthProvider")
     }
     return context
}
