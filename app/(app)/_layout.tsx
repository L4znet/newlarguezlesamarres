import React from "react"
import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native"
import merge from "deepmerge"
import { AuthProvider } from "@/modules/context/AuthProvider"
import { FlashMessageProvider } from "@/modules/context/FlashMessageProvider"
import { TranslationProvider } from "@/modules/context/TranslationContext"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/queryClient"
import { StripeProvider } from "@stripe/stripe-react-native"
import { registerTranslation } from "react-native-paper-dates"

const publishableKey = process.env.EXPO_PUBLIC_PUBLISHABLE_STRIPE_KEY as string

const customDarkTheme = {
     ...MD3DarkTheme,
     fonts: {
          ...MD3DarkTheme.fonts,
          regular: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" as "400" },
          medium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: "500" as "500" },
          bold: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: "700" as "700" },
          heavy: { ...MD3LightTheme.fonts.bodyLarge, fontWeight: "900" as "900" },
     },
}

const customLightTheme = {
     ...MD3LightTheme,
     fonts: {
          ...MD3LightTheme.fonts,
          regular: { ...MD3LightTheme.fonts.bodyMedium, fontWeight: "400" as "400" },
          medium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: "500" as "500" },
          bold: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: "700" as "700" },
          heavy: { ...MD3LightTheme.fonts.bodyLarge, fontWeight: "900" as "900" },
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
          <StripeProvider publishableKey={publishableKey}>
               <QueryClientProvider client={queryClient}>
                    <TranslationProvider>
                         <PaperProvider theme={paperTheme}>
                              <ThemeProvider value={paperTheme}>
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
                              </ThemeProvider>
                         </PaperProvider>
                    </TranslationProvider>
               </QueryClientProvider>
          </StripeProvider>
     )
}
