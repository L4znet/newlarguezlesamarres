import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useAuth } from "@/modules/context/AuthProvider"
import { router, Tabs } from "expo-router"
import TabBar from "@/modules/components/TabBar"

export default function Layout() {
     const { session } = useAuth()

     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              drawerLabel: "Accueil",
                              title: "Accueil",
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
