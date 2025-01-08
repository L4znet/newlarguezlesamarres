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
                              drawerItemStyle: { display: "none" },
                              headerShown: false,
                         }}
                    />
                    <Drawer.Screen
                         name="selectLocation"
                         options={{
                              title: t("drawer_select_location"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="selectRentalPeriod"
                         options={{
                              title: t("drawer_select_rental_period"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="selectEquipments"
                         options={{
                              title: t("drawer_select_equipments"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
                    <Drawer.Screen
                         name="selectBoat"
                         options={{
                              title: t("drawer_select_boat"),
                              drawerItemStyle: { display: "none" },
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
