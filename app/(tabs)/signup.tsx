import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"

export default function SignUp() {
     const [loginInfo, setLoginInfo] = useState({
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
     })

     const { signUp, loading } = useAuth()

     const handleSignUp = async () => {
          try {
               await signUp(loginInfo.email, loginInfo.password)
          } catch (error) {
               console.error("Signup failed", error)
          }
     }

     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Inscription</Text>
               <TextInput style={styles.input} label="Email" value={loginInfo.email} onChangeText={(email) => setLoginInfo({ ...loginInfo, email })} />
               <TextInput style={styles.input} label="Password" value={loginInfo.password} onChangeText={(password) => setLoginInfo({ ...loginInfo, password })} secureTextEntry />
               <Button icon="account-plus" mode="contained" onPress={handleSignUp} loading={loading} disabled={loading}>
                    Inscription
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
