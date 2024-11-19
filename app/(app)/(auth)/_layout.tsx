import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, router, Tabs } from "expo-router"
import AuthTabBar from "@/modules/components/AuthTabBar"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Layout() {
     const { user } = useAuth()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     useEffect(() => {
          if (user) router.replace("/(app)/(tabs)")
     }, [user])

     interface Route {
          key: string
          name: string
          params: any
          title?: string
     }

     interface TabBarProps {
          state: {
               routes: Route[]
               index: number
          }
          descriptors: any
          navigation: any
          insets: any
     }

     return (
          <Tabs
               tabBar={(props: TabBarProps) => <AuthTabBar {...props} />}
               screenOptions={{
                    headerShown: false,
               }}
          >
               <Tabs.Screen
                    name="index"
                    options={{
                         title: t("bottom_bar_index"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signin"
                    options={{
                         title: t("bottom_bar_login"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="sign-in" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="signup"
                    options={{
                         title: t("bottom_bar_register"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-plus" color={color} />,
                    }}
               />
               <Tabs.Screen name="forgot-password" />
          </Tabs>
     )
}
