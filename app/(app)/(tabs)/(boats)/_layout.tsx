import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useAuth } from "@/modules/context/AuthProvider"
import { router } from "expo-router"
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon"
import { useTheme } from "react-native-paper"
import { Appbar } from "react-native-paper"

export default function Layout() {
     const theme = useTheme()
     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              title: "Mes bateaux",
                         }}
                    />
                    <Drawer.Screen
                         name="addBoat"
                         options={{
                              title: "Ajouter un bateau",
                         }}
                    />

                    <Drawer.Screen
                         name="editBoat"
                         options={{
                              title: "Modifier un bateau",
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="boatDetails"
                         options={{
                              drawerItemStyle: { display: "none" },
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
