import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"

export default function Profile() {
     const { signOut } = useAuth()
     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Profile</Text>
               <Text variant="titleMedium">Title Medium</Text>
               <Button icon="login" mode="contained" onPress={signOut}>
                    Déconnexion
               </Button>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
})
