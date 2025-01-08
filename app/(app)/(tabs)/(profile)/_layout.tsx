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
                         name="tenantBookings"
                         options={{
                              drawerLabel: t("drawer_my_bookings_as_tenants"),
                              title: t("drawer_my_bookings_as_tenants"),
                         }}
                    />
                    <Drawer.Screen
                         name="renterBookings"
                         options={{
                              drawerLabel: t("drawer_my_bookings_as_renter"),
                              title: t("drawer_my_bookings_as_renter"),
                         }}
                    />
               </Drawer>
          </GestureHandlerRootView>
     )
}
