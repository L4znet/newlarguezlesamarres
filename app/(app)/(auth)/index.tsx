import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { router } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Index() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.title} variant="titleLarge">
                         {t("home_title")}
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         {t("home_subtitle")}
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         {t("home_noaccount")}
                    </Text>
               </View>
               <View style={styles.buttons}>
                    <Button style={styles.button} mode="contained" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         {t("login_btn")}
                    </Button>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signup")}>
                         {t("register_btn")}
                    </Button>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: 20,
          flexDirection: "column",
     },
     header: {
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
     },
     title: {
          width: "90%",
          textAlign: "center",
          display: "flex",
     },
     subtitle: {
          width: "90%",
          textAlign: "center",
          display: "flex",
          marginVertical: 10,
     },
     text: {
          fontSize: 16,
     },
     buttons: {
          width: "80%",
          justifyContent: "space-between",
          height: 80,
     },
     button: {
          marginTop: 30,
     },
})
