import { Text } from "react-native"
import { Redirect, router, Slot, Stack } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"

export default function AppLayout() {
     const { user, loading } = useAuth()

     if (loading) {
          return <Text>Loading...</Text>
     }

     if (!user) {
          router.push("/login")
     }

     return <Slot />
}
