import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import OwnOffersList from "@/modules/components/OwnOffersList"

export default function index() {
     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <OwnOffersList />
               </SafeAreaView>
               <FAB icon="plus" style={styles.fab} onPress={() => router.navigate("/(app)/(tabs)/(home)/createOffer")} />
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     safeView: {
          width: "100%",
          rowGap: 20,
          justifyContent: "center",
          alignItems: "center",
     },
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
     },
})
