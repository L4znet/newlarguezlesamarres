import React, { useEffect } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"

interface AuthGateProps {
     children: React.ReactNode
}

export const AuthGate = ({ children }: AuthGateProps) => {
     const { user, loading } = useAuth()
     const router = useRouter()

     useEffect(() => {
          if (!loading) {
               if (!user) {
                    router.replace("/(auth)")
               } else {
                    router.replace("/(tabs)")
               }
          }
     }, [user, loading])

     if (loading) {
          return null
     }

     return <>{children}</>
}
