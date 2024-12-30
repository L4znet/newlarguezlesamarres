import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"
import LanguageSwitcher from "@/modules/components/LanguageSwitcher"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Index() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     let language = ""
     switch (locale) {
          case "en":
               language = "English"
               break
          case "fr":
               language = "Français"
               break
          case "es":
               language = "Español"
               break
     }
     return (
          <View style={styles.container}>
               <Text variant="titleLarge">{t("settings_app_currently_in")}</Text>
               <Text variant="titleLarge">{language}</Text>
               <Text variant="titleMedium">{t("settings_change_language")}</Text>
               <LanguageSwitcher />
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
})
