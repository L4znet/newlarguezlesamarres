import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useAuth } from "@/modules/context/AuthProvider"
import { router, Stack } from "expo-router"
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon"
import { useTheme } from "react-native-paper"
import { Appbar } from "react-native-paper"
import { useTranslation, getTranslator } from "@/modules/context/TranslationContext"

export default function Layout() {
     const theme = useTheme()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <GestureHandlerRootView style={{ flex: 1 }}>
               <Stack>
                    <Stack.Screen
                         name="index"
                         options={{
                              headerShown: false,
                         }}
                    />
                    <Stack.Screen
                         name="checkout"
                         options={{
                              headerShown: false,
                         }}
                    />
               </Stack>
          </GestureHandlerRootView>
     )
}
