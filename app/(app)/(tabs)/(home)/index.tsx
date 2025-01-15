import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OffersList from "@/modules/components/OffersList"
import { useCountBoats } from "@/modules/hooks/boats/useCountBoats"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function Index() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     const { data: boatsCount } = useCountBoats()

     const createOffer = async () => {
          router.navigate("/(app)/(tabs)/(home)/createOffer")
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <OffersList />
               </SafeAreaView>
               <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={async () => {
                         if (boatsCount === 0) {
                              showTranslatedFlashMessage("warning", {
                                   title: "flash_title_warning",
                                   description: "flash_description_no_boats",
                              })
                         } else {
                              await createOffer()
                         }
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
