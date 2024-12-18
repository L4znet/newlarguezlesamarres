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
                    <Drawer.Screen
                         name="createOffer"
                         options={{
                              title: "Ajouter une annonce",
                         }}
                    />

                    <Drawer.Screen
                         name="editOffer"
                         options={{
                              title: "Modifier une annonce",
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="offerDetail"
                         options={{
                              drawerItemStyle: { display: "none" },
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
