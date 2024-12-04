import React, { createContext, useContext, useEffect, useState } from "react"
import AuthEntity from "../domain/auth/AuthEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"
import { subscribeToAuthChangesUseCase } from "@/modules/application/auth/subscribeToAuthChangeUseCase"
import { router } from "expo-router"

type AuthContextType = {
     user: AuthEntity | null
     signUp: (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [user, setUser] = useState<AuthEntity | null>(null)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const fetchCurrentUser = async () => {
          try {
               const currentUser = await getCurrentUserUseCase()
               if (currentUser) {
                    setUser(currentUser)
               } else {
                    setUser(null)
                    console.log("Aucun utilisateur connecté.")
               }
          } catch (error: any) {
               console.error("Erreur lors de la récupération de l'utilisateur actuel :", error)
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "Erreur lors de la récupération de l'utilisateur. Réessayez plus tard." })
          }
     }

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
                    setUser(loggedInUser)
               }
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     const signOut = async () => {
          try {
               await logoutUseCase()
               setUser(null)
               showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged out successfully" })
          } catch (error: any) {
               showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
          }
     }

     useEffect(() => {
          const fetchCurrentUser = async () => {
               try {
                    const currentUser = await getCurrentUserUseCase()

                    if (currentUser) {
                         setUser(currentUser)
                    } else {
                         setUser(null)
                         console.log("Aucun utilisateur connecté.")
                    }
               } catch (error: any) {
                    console.error("Erreur lors de la récupération de l'utilisateur actuel :", error)
                    showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: "Erreur lors de la récupération de l'utilisateur. Réessayez plus tard." })
               }
          }

          const initialCheck = async () => {
               const isConnected = await getCurrentUserUseCase()
               if (isConnected) {
                    fetchCurrentUser()
               }
          }

          initialCheck()

          const unsubscribe = subscribeToAuthChangesUseCase((user) => {
               if (user) {
                    fetchCurrentUser()
               } else {
                    setUser(null)
               }
          })

          return () => {
               unsubscribe()
          }
     }, [])

     return <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) {
          throw new Error("useAuth must be used within an AuthProvider")
     }
     return context
}
