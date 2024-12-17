import React, { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"

export default function Layout() {
     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              drawerLabel: "Mon profil",
                              title: "Mon profil",
                         }}
                    />
                    <Drawer.Screen
                         name="editProfile"
                         options={{
                              drawerLabel: "Modifier mon profil",
                              title: "Modifier mon profil",
                         }}
                    />
                    <Drawer.Screen
                         name="editEmail"
                         options={{
                              drawerLabel: "Modifier mon adresse e-mail",
                              title: "Modifier mon adresse e-mail",
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
