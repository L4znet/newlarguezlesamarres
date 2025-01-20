import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import BoatList from "@/app/components/BoatList"
import { useBoatStore } from "@/modules/stores/boatStore"

export default function index() {
     const { setBoatImages } = useBoatStore()
     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <BoatList />
               </SafeAreaView>
               <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => {
                         setBoatImages([])
                         router.navigate("/(app)/(tabs)/(boats)/createBoat")
                    }}
               />
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
