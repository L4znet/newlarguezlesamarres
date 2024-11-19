// AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react"
import AuthEntity from "../domain/auth/AuthEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"
import { parseObj } from "sucrase/dist/types/parser/traverser/expression"

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

     const signUp = async (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => {
          try {
               const user = await signupUseCase({ email, password, confirmPassword, firstname, lastname, username }, showTranslatedFlashMessage)
               setUser(user ?? null)
               if (user) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User successfully registered" })
               }
          } catch (error: any) {
               //showTranslatedFlashMessage("danger", [{ title: "flash_title_danger", description: error.message }])
               //throw new Error(error.message)
          }
     }

     const signIn = async (email: string, password: string) => {
          try {
               const user = await loginUseCase(email, password)
               setUser(user)
               showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User logged in successfully" })
          } catch (error: any) {
               showTranslatedFlashMessage("success", { title: "flash_title_danger", description: error.message })
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
                    }
               } catch (error: any) {
                    showTranslatedFlashMessage("danger", { title: "flash_title_danger", description: error.message })
               }
          }
          fetchCurrentUser()
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
