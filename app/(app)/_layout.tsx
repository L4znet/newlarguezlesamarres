import React from "react"
import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider, MD3Theme } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider as NavigationThemeProvider, Theme } from "@react-navigation/native"
import merge from "deepmerge"
import { Colors } from "@/constants/Colors"
import { AuthProvider } from "@/modules/context/AuthProvider"
import { FlashMessageProvider } from "@/modules/context/FlashMessageProvider"
import { TranslationProvider } from "@/modules/context/TranslationContext"

// Création des thèmes personnalisés pour React Native Paper
const customDarkPaperTheme: MD3Theme = {
     ...MD3DarkTheme,
     colors: {
          ...MD3DarkTheme.colors,
          ...Colors.dark,
     },
     fonts: {
          ...MD3DarkTheme.fonts,
          bodyMedium: { ...MD3DarkTheme.fonts.bodyMedium, fontWeight: "400" as const },
          titleMedium: { ...MD3DarkTheme.fonts.titleMedium, fontWeight: "500" as const },
          headlineMedium: { ...MD3DarkTheme.fonts.headlineMedium, fontWeight: "700" as const },
          bodyLarge: { ...MD3DarkTheme.fonts.bodyLarge, fontWeight: "900" as const },
     },
}

const customLightPaperTheme: MD3Theme = {
     ...MD3LightTheme,
     colors: {
          ...MD3LightTheme.colors,
          ...Colors.light,
     },
     fonts: {
          ...MD3LightTheme.fonts,
          bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" as const },
          titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: "500" as const },
          headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: "700" as const },
          bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontWeight: "900" as const },
     },
}

// Adapter les thèmes de React Navigation pour qu'ils soient compatibles
const { LightTheme, DarkTheme } = adaptNavigationTheme({
     reactNavigationLight: NavigationDefaultTheme,
     reactNavigationDark: NavigationDarkTheme,
})

// Fusionner les thèmes de Navigation avec les couleurs personnalisées
const CombinedLightTheme: Theme = {
     ...LightTheme,
     colors: {
          ...LightTheme.colors,
          ...customLightPaperTheme.colors,
     },
     dark: LightTheme.dark,
     fonts: {
          regular: {
               fontFamily: "System",
               fontWeight: "400" as const,
          },
          medium: {
               fontFamily: "System",
               fontWeight: "500" as const,
          },
          bold: {
               fontFamily: "System",
               fontWeight: "700" as const,
          },
          heavy: {
               fontFamily: "System",
               fontWeight: "900" as const,
          },
     },
}

const CombinedDarkTheme: Theme = {
     ...DarkTheme,
     colors: {
          ...DarkTheme.colors,
          ...customDarkPaperTheme.colors,
     },
     dark: DarkTheme.dark,
     fonts: {
          regular: {
               fontFamily: "System",
               fontWeight: "400" as const,
          },
          medium: {
               fontFamily: "System",
               fontWeight: "500" as const,
          },
          bold: {
               fontFamily: "System",
               fontWeight: "700" as const,
          },
          heavy: {
               fontFamily: "System",
               fontWeight: "900" as const,
          },
     },
}

export default function RootLayout() {
     const colorScheme = useColorScheme()
     const paperTheme = colorScheme === "dark" ? customDarkPaperTheme : customLightPaperTheme
     const navigationTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme

     return (
          <PaperProvider theme={paperTheme}>
               <NavigationThemeProvider value={navigationTheme}>
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
               </NavigationThemeProvider>
          </PaperProvider>
     )
}
