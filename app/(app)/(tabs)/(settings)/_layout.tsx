import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useAuth } from "@/modules/context/AuthProvider"
import { router } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Layout() {
     const { user } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     useEffect(() => {
          if (!user) router.replace("/(app)/(auth)")
     }, [user])
     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              drawerLabel: t("drawer_setting_btn"),
                              title: t("settings_title"),
                         }}
                    />
                    <Drawer.Screen
                         name="languages"
                         options={{
                              drawerLabel: t("drawer_settings_change_language"),
                              title: t("settings_language"),
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
