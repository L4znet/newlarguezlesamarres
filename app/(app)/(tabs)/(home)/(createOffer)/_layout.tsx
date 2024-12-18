import React, { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { useTheme } from "react-native-paper"
import { Stack } from "expo-router"

export default function Layout() {
     const theme = useTheme()
     return (
          <Stack>
               <Stack.Screen
                    name="index"
                    options={{
                         title: "Publier une annonce",
                         headerLargeTitle: true,
                    }}
               />
               <Stack.Screen
                    name="selectLocation"
                    options={{
                         title: "Choisir une localisation",
                         headerBackTitle: "Retour",
                         headerLargeTitle: true,
                    }}
               />
               <Stack.Screen
                    name="selectRentalPeriod"
                    options={{
                         title: "Sélectionnez une période de location",
                         headerBackTitle: "Retour",
                         headerLargeTitle: true,
                    }}
               />
               <Stack.Screen
                    name="selectEquipments"
                    options={{
                         title: "Définissez les équipements",
                         headerBackTitle: "Retour",
                         headerLargeTitle: true,
                    }}
               />
               <Stack.Screen
                    name="selectBoat"
                    options={{
                         title: "Sélectionnez le bateau associé",
                         headerBackTitle: "Retour",
                         headerLargeTitle: true,
                    }}
               />
          </Stack>
     )
}
