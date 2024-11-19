import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { router } from "expo-router"

export default function Index() {
     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.title} variant="titleLarge">
                         Bonjour et bienvenue sur Larguez les amarres !
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         Pour une expérience plus confortable à bord, connectez-vous !
                    </Text>
                    <Text style={styles.subtitle} variant="titleMedium">
                         Si vous n'avez pas de compte, inscrivez-vous
                    </Text>
               </View>
               <View style={styles.buttons}>
                    <Button style={styles.button} mode="contained" onPress={() => router.replace("/(app)/(auth)/signin")}>
                         Connexion
                    </Button>
                    <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signup")}>
                         Inscription
                    </Button>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: 20,
          flexDirection: "column",
     },
     header: {
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
     },
     title: {
          width: "90%",
          textAlign: "center",
          display: "flex",
     },
     subtitle: {
          width: "90%",
          textAlign: "center",
          display: "flex",
          marginVertical: 10,
     },
     text: {
          fontSize: 16,
     },
     buttons: {
          width: "80%",
          justifyContent: "space-between",
          height: 80,
     },
     button: {
          marginTop: 30,
     },
})
