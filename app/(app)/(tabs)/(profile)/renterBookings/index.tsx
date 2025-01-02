import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import BookingsRenterList from "@/modules/components/BookingsRenterList"

export default function index() {
     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <BookingsRenterList />
               </SafeAreaView>
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
