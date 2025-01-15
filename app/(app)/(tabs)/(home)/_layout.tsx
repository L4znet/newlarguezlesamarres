import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useAuth } from "@/modules/context/AuthProvider"
import { router, Stack, Tabs } from "expo-router"
import TabBar from "@/modules/components/TabBar"
import { useTranslation, getTranslator } from "@/modules/context/TranslationContext"
import { useCountBoats } from "@/modules/hooks/boats/useCountBoats"

export default function Layout() {
     const { session } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { data: countBoats, isPending: countBoatsIsPending, error: countBoatsError } = useCountBoats()

     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Drawer>
                    <Drawer.Screen
                         name="index"
                         options={{
                              drawerLabel: t("drawer_home"),
                              title: t("drawer_home"),
                         }}
                    />
                    <Drawer.Screen
                         name={"createOffer"}
                         options={{
                              drawerLabel: t("drawer_add_offer"),
                              title: t("drawer_add_offer"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name={"editOffer"}
                         options={{
                              drawerLabel: t("drawer_edit_offer"),
                              title: t("drawer_edit_offer"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="offerDetail"
                         options={{
                              title: t("drawer_offer_detail"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
