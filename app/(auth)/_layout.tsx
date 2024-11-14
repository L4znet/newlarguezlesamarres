import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { router, Tabs } from "expo-router"
import TabBar from "@/modules/components/AuthTabBar"

export default function Layout() {
     return (
          <Tabs
               tabBar={(props) => <TabBar {...props} />}
               screenOptions={{
                    headerShown: false,
               }}
          >
               <Tabs.Screen
                    name="index"
                    options={{
                         title: "Index",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signin"
                    options={{
                         title: "Connexion",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signup"
                    options={{
                         title: "Inscription",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
          </Tabs>
     )
}
