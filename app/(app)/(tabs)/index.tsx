import { Text } from "react-native-paper"
import React from "react"
import { StyleSheet, View } from "react-native"
import { getTranslator } from "@/modules/context/TranslationContext"

export default function Index() {
     const t = getTranslator()

     return (
          <View style={styles.container}>
               <Text variant="titleLarge">{t("home_title")}</Text>
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
