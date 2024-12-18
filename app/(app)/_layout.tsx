import React, { useCallback, useRef } from "react"
import { Redirect, Stack } from "expo-router"
import { useColorScheme, StyleSheet } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native"
import merge from "deepmerge"
import { AuthProvider } from "@/modules/context/AuthProvider"
import { FlashMessageProvider } from "@/modules/context/FlashMessageProvider"
import { TranslationProvider } from "@/modules/context/TranslationContext"
import { ProfileProvider } from "@/modules/context/ProfileProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/queryClient"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const customDarkTheme = {
     ...MD3DarkTheme,
     fonts: {
          ...MD3DarkTheme.fonts,
          regular: { ...MD3DarkTheme.fonts.bodyMedium, fontWeight: "400" },
          medium: { ...MD3DarkTheme.fonts.titleMedium, fontWeight: "500" },
          bold: { ...MD3DarkTheme.fonts.headlineMedium, fontWeight: "700" },
          heavy: { ...MD3DarkTheme.fonts.bodyLarge, fontWeight: "900" },
     },
}

const customLightTheme = {
     ...MD3LightTheme,
     fonts: {
          ...MD3LightTheme.fonts,
          regular: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" },
          medium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: "500" },
          bold: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: "700" },
          heavy: { ...MD3LightTheme.fonts.bodyLarge, fontWeight: "900" },
     },
}

const { LightTheme, DarkTheme } = adaptNavigationTheme({
     reactNavigationLight: NavigationDefaultTheme,
     reactNavigationDark: NavigationDarkTheme,
})

const CombinedLightTheme = merge(LightTheme, customLightTheme)
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme)

export default function RootLayout() {
     const colorScheme = useColorScheme()
     const paperTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme

     return (
          <QueryClientProvider client={queryClient}>
               <TranslationProvider>
                    <PaperProvider theme={paperTheme}>
                         <ThemeProvider value={paperTheme}>
                              <FlashMessageProvider>
                                   <ProfileProvider>
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
                                   </ProfileProvider>
                              </FlashMessageProvider>
                         </ThemeProvider>
                    </PaperProvider>
               </TranslationProvider>
          </QueryClientProvider>
     )
}
