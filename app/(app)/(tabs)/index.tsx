import { Text } from "react-native-paper"
import React from "react"
import { StyleSheet, View } from "react-native"

export default function Index() {
     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Bonjour et bienvenue sur Larguez les amarres !</Text>
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
