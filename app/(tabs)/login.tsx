import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"

export default function Login() {
     const [loginInfo, setLoginInfo] = useState({
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
     })

     const { signIn, loading } = useAuth()

     const handleLogin = async () => {
          try {
               await signIn(loginInfo.email, loginInfo.password)
          } catch (error) {
               console.error("Login failed", error)
          }
     }

     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Connexion</Text>
               <TextInput style={styles.input} label="Email" value={loginInfo.email} onChangeText={(email) => setLoginInfo({ ...loginInfo, email })} />
               <TextInput style={styles.input} label="Password" value={loginInfo.password} onChangeText={(password) => setLoginInfo({ ...loginInfo, password })} secureTextEntry />
               <Button icon="login" mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
                    Connexion
               </Button>
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
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     input: {
          width: "80%",
          marginVertical: 10,
     },
})
