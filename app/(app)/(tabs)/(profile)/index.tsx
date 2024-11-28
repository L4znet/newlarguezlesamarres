import React from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import LanguageSwitcher from "@/modules/components/LanguageSwitcher"
import { router } from "expo-router"

export default function Index() {
     const { signOut } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <View style={styles.container}>
               <View style={styles.profile}>
                    <View style={styles.profileHeader}>
                         <Avatar.Image size={150} source={require("@/assets/images/avatar.jpeg")} />
                         <Text style={styles.title}>JohnDoe</Text>
                         <Text style={styles.text}>John Doe</Text>
                         <Text style={styles.text}>Charly.escalona1@gmail.com</Text>
                    </View>
                    <View style={styles.profileContent}>
                         <Button icon="pencil" mode="contained" onPress={() => router.replace("/(app)/(tabs)/(profile)/editProfile")}>
                              {t("edit_profile_btn")}
                         </Button>
                    </View>
                    <View style={styles.profileFooter}>
                         <Button icon="login" mode="contained" onPress={signOut}>
                              {t("logout_btn")}
                         </Button>
                    </View>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     profile: {
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          flex: 1,
     },
     profileHeader: {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
     },
     profileContent: {
          alignItems: "center",
          width: "90%",
          flex: 1,
          marginTop: 20,
     },
     profileFooter: {
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          marginBottom: 20,
     },
     input: {
          width: "90%",
          marginVertical: 10,
     },
})
