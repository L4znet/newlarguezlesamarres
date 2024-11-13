import "expo-router/entry" // Charge le routeur Expo
import React from "react"
import { AuthProvider, useAuth } from "@/modules/context/AuthProvider"
import { PaperProvider } from "react-native-paper"
import { ThemeProvider } from "@react-navigation/native"
import { useColorScheme } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from "react-native-paper"
import merge from "deepmerge"
import { Colors } from "@/constants/Colors"
import { Slot, useRouter } from "expo-router"
import { AuthGate } from "@/modules/components/AuthGate"

const customDarkTheme = {
     ...MD3DarkTheme,
     colors: Colors.dark,
     fonts: {
          ...MD3DarkTheme.fonts,
          regular: { ...MD3DarkTheme.fonts.bodyMedium, fontWeight: "400" as const },
     },
}

const customLightTheme = {
     ...MD3LightTheme,
     colors: Colors.light,
     fonts: {
          ...MD3LightTheme.fonts,
          regular: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" as const },
     },
}

const { LightTheme, DarkTheme } = adaptNavigationTheme({
     reactNavigationLight: customLightTheme,
     reactNavigationDark: customDarkTheme,
})

const CombinedLightTheme = merge(LightTheme, customLightTheme)
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme)

export default function Root() {
     const colorScheme = useColorScheme()
     const paperTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme

     return (
          <PaperProvider theme={paperTheme}>
               <ThemeProvider value={paperTheme}>
                    <AuthProvider>
                         <AuthGate>
                              <Slot />
                         </AuthGate>
                    </AuthProvider>
               </ThemeProvider>
          </PaperProvider>
     )
}
