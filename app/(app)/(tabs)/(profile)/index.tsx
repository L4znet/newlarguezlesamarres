import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, Button, Text, TextInput, ActivityIndicator, useTheme } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useProfile } from "@/modules/hooks/profiles/useProfile"

export default function Index() {
     const { signOut } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { data: profile, isPending, error } = useProfile()
     const theme = useTheme()

     if (!profile) {
          return (
               <View style={styles.container}>
                    <Text>{t("no_account_found")}</Text>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
               </View>
          )
     }

     if (isPending) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     return (
          <View style={styles.container}>
               <View style={styles.profile}>
                    <View style={styles.profileHeader}>
                         <Avatar.Image size={150} source={{ uri: profile.avatar_url }} />
                         <Text style={styles.title}>{profile?.username}</Text>
                         <Text style={styles.text}>
                              {profile?.firstname} {profile?.lastname}
                         </Text>
                         <Text style={styles.text}>{profile?.email}</Text>
                    </View>
                    <View style={styles.profileContent}></View>
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
