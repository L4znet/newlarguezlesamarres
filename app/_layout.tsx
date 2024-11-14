import React from "react"
import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native"
import merge from "deepmerge"
import { Colors } from "@/constants/Colors"

const customDarkTheme = {
     ...MD3DarkTheme,
     colors: Colors.dark,
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
     colors: Colors.dark,
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
          <PaperProvider theme={paperTheme}>
               <ThemeProvider value={paperTheme}>
                    &
                    <Stack>
                         <Stack.Screen
                              name="(auth)"
                              options={{
                                   headerShown: false,
                              }}
                         />
                         <Stack.Screen
                              name="(tabs)"
                              options={{
                                   headerShown: false,
                              }}
                         />
                    </Stack>
               </ThemeProvider>
          </PaperProvider>
     )
}
