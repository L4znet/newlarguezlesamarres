import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { router, Tabs } from "expo-router"
import AuthTabBar from "@/modules/components/AuthTabBar"

export default function Layout() {
     return (
          <Tabs
               tabBar={(props) => <AuthTabBar {...props} />}
               screenOptions={{
                    headerShown: false,
               }}
          >
               <Tabs.Screen
                    name="index"
                    options={{
                         title: "Accueil",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signin"
                    options={{
                         title: "Connexion",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="sign-in" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signup"
                    options={{
                         title: "Inscription",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-plus" color={color} />,
                    }}
               />
               <Tabs.Screen name="forgot-password" />
          </Tabs>
     )
}
