import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

export default function Index() {
     return (
          <View style={styles.container}>
               <Text variant="titleLarge">Settings</Text>
               <Text variant="titleMedium">Title Medium</Text>
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
