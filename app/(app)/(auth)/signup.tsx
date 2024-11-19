import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"

export default function Signup() {
     const [userInfo, setUserInfo] = useState({
          lastname: "Escalona",
          firstname: "Charly",
          username: "cyrlah",
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
          confirmPassword: "testtesttesttest",
     })

     const [error, setError] = useState<string | null>(null)

     const { signUp } = useAuth()

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text variant="titleLarge">C'est votre première fois ici ?</Text>
                    <Text variant="titleMedium">Créez votre compte !</Text>
                    <TextInput style={styles.input} label="Nom" value={userInfo.lastname} onChangeText={(lastname) => setUserInfo({ ...userInfo, lastname })} />
                    <TextInput style={styles.input} label="Prénom" value={userInfo.firstname} onChangeText={(firstname) => setUserInfo({ ...userInfo, firstname })} />
                    <TextInput style={styles.input} label="Pseudo" value={userInfo.username} onChangeText={(username) => setUserInfo({ ...userInfo, username })} />
                    <TextInput style={styles.input} label="E-mail" value={userInfo.email} onChangeText={(email) => setUserInfo({ ...userInfo, email })} />
                    <TextInput style={styles.input} label="Password" value={userInfo.password} onChangeText={(password) => setUserInfo({ ...userInfo, password })} secureTextEntry />
                    <TextInput style={styles.input} label="Confirmez le mot de passe" value={userInfo.confirmPassword} onChangeText={(confirmPassword) => setUserInfo({ ...userInfo, confirmPassword })} secureTextEntry />
                    <Button
                         icon="login"
                         mode="contained"
                         style={styles.login}
                         onPress={async () => {
                              await signUp(userInfo.email, userInfo.password, userInfo.confirmPassword, userInfo.firstname, userInfo.lastname, userInfo.username)
                         }}
                    >
                         Inscription
                    </Button>
               </View>
               <View style={styles.buttons}>
                    <Text variant="titleLarge" style={styles.noAccount}>
                         Vous avez déjà un compte ? Connectez-vous
                    </Text>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         J'ai un compte !
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
