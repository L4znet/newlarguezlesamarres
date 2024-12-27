import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { router } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { recoverPasswordUseCase } from "@/modules/application/auth/recoverPasswordUseCase"

export default function ForgotPassword() {
     const { user } = useAuth()
     const [email, setEmail] = useState("charly.escalona1@gmail.com")

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const handleForgotPassword = async () => {
          await recoverPasswordUseCase(email)
     }

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text style={styles.title} variant="titleLarge">
                         {t("forgot_password_title")}
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         {t("forgot_password_subtitle")}
                    </Text>
                    <TextInput style={styles.input} placeholder={t("forgot_password_email_placeholder")} label={t("forgot_password_email_label")} value={email} onChangeText={(email) => setEmail(email)} />
                    <Button icon="login" mode="contained" style={styles.login} onPress={() => handleForgotPassword()}>
                         {t("forgot_password_submit")}
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         {t("forgot_remembered_password_title")}
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         {t("forgot_remembered_password_login")}
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
          textAlign: "center",
     },
     subtitle: {
          textAlign: "center",
          marginVertical: 10,
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
