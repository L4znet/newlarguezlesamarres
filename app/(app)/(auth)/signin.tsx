import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Signin() {
     const [loginInfo, setLoginInfo] = useState({
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
     })

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const [error, setError] = useState<string | null>(null)

     const { signIn } = useAuth()

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text variant="titleLarge">{t("login_title")}</Text>
                    <Text variant="titleMedium">{t("login_subtitle")}</Text>
                    <TextInput style={styles.input} placeholder={t("email_placeholder")} label={t("email_label")} value={loginInfo.email} onChangeText={(email) => setLoginInfo({ ...loginInfo, email })} />
                    <TextInput style={styles.input} placeholder={t("password_placeholder")} label={t("password_label")} value={loginInfo.password} onChangeText={(password) => setLoginInfo({ ...loginInfo, password })} secureTextEntry />
                    <Button icon="login" mode="contained" style={styles.login} onPress={() => signIn(loginInfo.email, loginInfo.password)}>
                         {t("login_submit")}
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/forgot-password")}>
                         {t("forgot_password_btn")}
                    </Button>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         {t("login_noaccount")}
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         {t("login_signup_btn")}
                    </Button>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
     },
     form: {
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     login: {
          marginTop: 20,
     },
     input: {
          width: "90%",
          marginVertical: 10,
     },
     buttons: {
          width: "80%",
          justifyContent: "space-between",
          height: 100,
     },
     button: {
          marginTop: 30,
     },
     noAccount: {
          marginTop: 20,
          textAlign: "center",
     },
})
