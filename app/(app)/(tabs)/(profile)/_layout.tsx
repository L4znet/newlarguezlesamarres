import React, { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Layout() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              drawerLabel: t("drawer_profile"),
                              title: t("drawer_profile"),
                         }}
                    />
                    <Drawer.Screen
                         name="editProfile"
                         options={{
                              drawerLabel: t("drawer_edit_profile"),
                              title: t("drawer_edit_profile"),
                         }}
                    />
                    <Drawer.Screen
                         name="editEmail"
                         options={{
                              drawerLabel: t("drawer_edit_email"),
                              title: t("drawer_edit_email"),
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
