import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import LanguageSwitcher from "@/modules/components/LanguageSwitcher"

export default function Profile() {
     const { signOut } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Profile</Text>
               <Text variant="titleMedium">Title Medium</Text>

               <LanguageSwitcher />

               <Button icon="login" mode="contained" onPress={signOut}>
                    {t("logout_btn")}
               </Button>
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
