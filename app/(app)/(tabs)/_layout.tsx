import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, router, Tabs } from "expo-router"
import TabBar from "@/modules/components/TabBar"
import { useAuth } from "@/modules/context/AuthProvider"

export default function Layout() {
     const { user } = useAuth()
     useEffect(() => {
          if (!user) router.replace("/(app)/(auth)")
     }, [user])
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
                         title: "Feed",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="profile"
                    options={{
                         title: "Profile",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="settings"
                    options={{
                         title: "Settings",
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="cogs" color={color} />,
                    }}
               />
          </Tabs>
     )
}
