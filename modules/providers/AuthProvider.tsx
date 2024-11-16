import React, { createContext, useContext, useState, useEffect } from "react"
import AuthEntity from "../domain/auth/AuthEntity"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"

type AuthContextType = {
     user: AuthEntity | null
     signUp: (email: string, password: string, confirmPassword: string, firstName: string, lastName: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [user, setUser] = useState<AuthEntity | null>(null)

     const signUp = async (email: string, password: string, confirmPassword: string, firstname: string, lastname: string) => {
          const user = await signupUseCase({ email, password, confirmPassword, firstname, lastname })
          setUser(user)
     }

     const signIn = async (email: string, password: string) => {
          const user = await loginUseCase(email, password)
          setUser(user)
     }

     const signOut = async () => {
          await logoutUseCase()
          setUser(null)
     }

     useEffect(() => {
          const fetchCurrentUser = async () => {
               const currentUser = await getCurrentUserUseCase()
               if (currentUser) {
                    setUser(AuthEntity.fromSupabaseUser(currentUser))
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
