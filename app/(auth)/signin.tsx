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
                    <Text variant="titleLarge">Vous avez déjà un compte ?</Text>
                    <Text variant="titleMedium">Connectez-vous !</Text>
                    <TextInput style={styles.input} label="Email" value={loginInfo.email} onChangeText={(email) => setLoginInfo({ ...loginInfo, email })} />
                    <TextInput style={styles.input} label="Password" value={loginInfo.password} onChangeText={(password) => setLoginInfo({ ...loginInfo, password })} secureTextEntry />
                    <Button icon="login" mode="contained" style={styles.login}>
                         Connexion
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(auth)/forgot-password")}>
                         Mot de passe oublié
                    </Button>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         Pas de compte ? Aucun problème
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(auth)/signup")}>
                         Je file me créer un compte
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
