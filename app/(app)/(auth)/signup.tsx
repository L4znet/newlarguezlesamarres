import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator } from "@/modules/context/TranslationContext"

export default function Signup() {
     const [userInfo, setUserInfo] = useState({
          lastname: "Escalona",
          firstname: "Charly",
          username: "cyrlah",
          email: "charly.escalona1@gmail.com",
          password: "s",
          confirmPassword: "t",
     })

     const { signUp } = useAuth()

     const t = getTranslator()

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text variant="titleLarge">{t("register_title")}</Text>
                    <Text variant="titleMedium">{t("register_subtitle")}</Text>
                    <TextInput style={styles.input} placeholder={t("register_lastname_placeholder")} label={t("register_email_label")} value={userInfo.lastname} onChangeText={(lastname) => setUserInfo({ ...userInfo, lastname })} />
                    <TextInput style={styles.input} placeholder={t("register_firstname_placeholder")} label={t("register_lastname_label")} value={userInfo.firstname} onChangeText={(firstname) => setUserInfo({ ...userInfo, firstname })} />
                    <TextInput style={styles.input} placeholder={t("register_username_placeholder")} label={t("register_firstname_label")} value={userInfo.username} onChangeText={(username) => setUserInfo({ ...userInfo, username })} />
                    <TextInput style={styles.input} placeholder={t("register_email_placeholder")} label={t("register_email_label")} value={userInfo.email} onChangeText={(email) => setUserInfo({ ...userInfo, email })} />
                    <TextInput style={styles.input} placeholder={t("register_password_placeholder")} label={t("register_password_label")} value={userInfo.password} onChangeText={(password) => setUserInfo({ ...userInfo, password })} secureTextEntry />
                    <TextInput style={styles.input} placeholder={t("register_password_confirm_placeholder")} label={t("register_password_confirm_label")} value={userInfo.confirmPassword} onChangeText={(confirmPassword) => setUserInfo({ ...userInfo, confirmPassword })} secureTextEntry />
                    <Button
                         icon="login"
                         mode="contained"
                         style={styles.login}
                         onPress={async () => {
                              await signUp(userInfo.email, userInfo.password, userInfo.confirmPassword, userInfo.firstname, userInfo.lastname, userInfo.username)
                         }}
                    >
                         {t("register_submit")}
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         {t("register_already_account")}
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         {t("register_login_btn")}
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
