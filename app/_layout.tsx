import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from "react-native-paper"

import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native"

import merge from "deepmerge"

import { Colors } from "@/constants/Colors"

const customDarkTheme = {
     ...MD3DarkTheme,
     colors: Colors.dark,
     fonts: {
          ...MD3DarkTheme.fonts,
          regular: MD3DarkTheme.fonts.regular,
          medium: MD3DarkTheme.fonts.medium,
          bold: MD3DarkTheme.fonts.bold,
          heavy: MD3DarkTheme.fonts.heavy,
     },
}
const customLightTheme = {
     ...MD3LightTheme,
     colors: Colors.light,
     fonts: {
          ...MD3LightTheme.fonts,
          regular: MD3LightTheme.fonts.regular,
          medium: MD3LightTheme.fonts.medium,
          bold: MD3LightTheme.fonts.bold,
          heavy: MD3LightTheme.fonts.heavy,
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
                    <Stack>
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
