import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { router } from "expo-router"

export default function Signin() {
     const [loginInfo, setLoginInfo] = useState({
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
     })

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text style={styles.title} variant="titleLarge">
                         Impossible de vous souvenir de votre mot de passe ?
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         Cela arrive ! Nous allons vous aider à le récupérer
                    </Text>
                    <TextInput style={styles.input} label="Email" value={loginInfo.email} onChangeText={(email) => setLoginInfo({ ...loginInfo, email })} />
                    <TextInput style={styles.input} label="Password" value={loginInfo.password} onChangeText={(password) => setLoginInfo({ ...loginInfo, password })} secureTextEntry />
                    <Button icon="login" mode="contained" style={styles.login}>
                         Connexion
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         Finalement je m'en souviens !
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(auth)/signin")}>
                         Je me connecte !
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
