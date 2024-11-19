import React from "react"
import { Redirect, Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider, MD3Theme } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native"
import merge from "deepmerge"
import { Colors } from "@/constants/Colors"
import { AuthProvider } from "@/modules/context/AuthProvider"
import { FlashMessageProvider } from "@/modules/context/FlashMessageProvider"
import { TranslationProvider } from "@/modules/context/TranslationContext"

// Définir les thèmes personnalisés
const customDarkTheme: MD3Theme = {
     ...MD3DarkTheme,
     colors: Colors.dark,
     fonts: {
          ...MD3DarkTheme.fonts,
          regular: { ...MD3DarkTheme.fonts.bodyMedium, fontWeight: "400" as const },
          medium: { ...MD3DarkTheme.fonts.titleMedium, fontWeight: "500" as const },
          bold: { ...MD3DarkTheme.fonts.headlineMedium, fontWeight: "700" as const },
          heavy: { ...MD3DarkTheme.fonts.bodyLarge, fontWeight: "900" as const },
     },
}

const customLightTheme: MD3Theme = {
     ...MD3LightTheme,
     colors: Colors.light,
     fonts: {
          ...MD3LightTheme.fonts,
          regular: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" as const },
          medium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: "500" as const },
          bold: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: "700" as const },
          heavy: { ...MD3LightTheme.fonts.bodyLarge, fontWeight: "900" as const },
     },
}

// Fusionner les thèmes avec react-navigation
const { LightTheme, DarkTheme } = adaptNavigationTheme({
     reactNavigationLight: NavigationDefaultTheme,
     reactNavigationDark: NavigationDarkTheme,
})

const CombinedLightTheme: MD3Theme = merge(LightTheme, customLightTheme)
const CombinedDarkTheme: MD3Theme = merge(DarkTheme, customDarkTheme)

export default function RootLayout() {
     const colorScheme = useColorScheme()
     const paperTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme

     return (
          <PaperProvider theme={paperTheme}>
               <ThemeProvider value={paperTheme}>
                    <TranslationProvider>
                         <FlashMessageProvider>
                              <AuthProvider>
                                   <Stack
                                        screenOptions={{
                                             headerShown: false,
                                        }}
                                   >
                                        <Stack.Screen name="(auth)" />
                                        <Stack.Screen name="(tabs)" />
                                   </Stack>
                              </AuthProvider>
                         </FlashMessageProvider>
                    </TranslationProvider>
               </ThemeProvider>
          </PaperProvider>
     )
}
