import { Session, User } from "@supabase/supabase-js"
import { useContext, useState, useEffect, createContext, ReactNode } from "react"
import { supabase } from "@/modules/utils/api"
import { loginUseCase } from "@/modules/application/auth/loginUseCase"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import { logoutUseCase } from "@/modules/application/auth/logoutUseCase"

interface AuthContextType {
     session: Session | null | undefined
     user: User | null | undefined
     signIn: (email: string, password: string) => Promise<void>
     signUp: (email: string, password: string) => Promise<void>
     signOut: () => void
     loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
     const [user, setUser] = useState<User | null>(null)
     const [session, setSession] = useState<Session | null>(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
          const initSession = async () => {
               const {
                    data: { session },
               } = await supabase.auth.getSession()
               setSession(session)
               setUser(session?.user ?? null)
               setLoading(false)
          }

          initSession()

          const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
               setSession(session)
               setUser(session?.user ?? null)
               setLoading(false)
          })

          return () => {
               subscription?.subscription?.unsubscribe()
          }
     }, [])

     const signIn = async (email: string, password: string) => {
          try {
               setLoading(true)
               const user = await loginUseCase(email, password)
               if (user) {
                    setUser(user)
                    const {
                         data: { session },
                    } = await supabase.auth.getSession()
                    setSession(session)
               }
          } catch (error) {
               console.error("Login failed", error)
          } finally {
               setLoading(false)
          }
     }

     const signUp = async (email: string, password: string) => {
          try {
               setLoading(true)
               await signupUseCase(email, password)
               await signIn(email, password)
          } catch (error) {
               console.error("Signup failed", error)
          } finally {
               setLoading(false)
          }
     }

     const signOut = async () => {
          try {
               setLoading(true)
               await logoutUseCase()
               setUser(null)
               setSession(null)
          } catch (error) {
               console.error("Logout failed", error)
          } finally {
               setLoading(false)
          }
     }

     return <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
     const context = useContext(AuthContext)

     if (context === undefined) {
          throw new Error("useAuth must be used within an AuthProvider")
     }

     const { user, session, loading, signIn, signUp, signOut } = context

     const isAuthenticated = !!session

     const userEmail = user?.email || null

     return {
          user,
          session,
          loading,
          signIn,
          signUp,
          signOut,
          isAuthenticated,
          userEmail,
     }
}
