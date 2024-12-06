import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, router, Tabs } from "expo-router"
import TabBar from "@/modules/components/TabBar"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Layout() {
     const { user } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
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
                    name="(home)"
                    options={{
                         title: t("bottom_bar_(home)/index"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(profile)"
                    options={{
                         title: t("bottom_bar_(profile)"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(boats)"
                    options={{
                         title: t("bottom_bar_(boats)"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="anchor" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(settings)"
                    options={{
                         title: t("bottom_bar_settings"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="cogs" color={color} />,
                    }}
               />
          </Tabs>
     )
}
