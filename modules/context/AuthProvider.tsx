import React, { createContext, useContext, useState, useEffect } from "react"
import AuthEntity from "../domain/auth/AuthEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"

type AuthContextType = {
     user: AuthEntity | null
     signUp: (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [user, setUser] = useState<AuthEntity | null>(null)
     const { setFlashMessage } = useFlashMessage()

     /**
      * Sign up the user
      *
      * @param email
      * @param password
      * @param confirmPassword
      * @param firstname
      * @param lastname
      * @param username
      */
     const signUp = async (email: string, password: string, confirmPassword: string, firstname: string, lastname: string, username: string) => {
          try {
               const user = await signupUseCase({ email, password, confirmPassword, firstname, lastname, username })
               setUser(user ?? null)
               setFlashMessage("success", "Registration successful!")
          } catch (error: any) {
               setFlashMessage("error", error.message)
               throw new Error(error.message)
          }
     }

     /**
      * Login the user
      *
      * @param email
      * @param password
      */
     const signIn = async (email: string, password: string) => {
          try {
               const user = await loginUseCase(email, password)
               setUser(user)
               setFlashMessage("success", "Sign in successful!")
          } catch (error: any) {
               setFlashMessage("error", error.message)
          }
     }

     /**
      * Logout the user
      *
      */
     const signOut = async () => {
          try {
               await logoutUseCase()
               setUser(null)
               setFlashMessage("success", "You have successfully signed out.")
          } catch (error: any) {
               setFlashMessage("error", error.message)
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
                    setFlashMessage("error", error.message)
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
