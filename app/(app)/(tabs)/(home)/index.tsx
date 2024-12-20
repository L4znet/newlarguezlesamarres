import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { Card, Button } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import OfferList from "@/modules/components/OfferList"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"
import { undefined } from "zod"

export default function Index() {
     const [isLoading, setIsLoading] = useState(false)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const { setRentalPeriod, setLocation, setEquipments, setCurrentOffer } = useOfferExternalScreenStore()

     const createOffer = async () => {
          router.navigate("/(app)/(tabs)/(home)/createOffer")
          setLocation({
               city: "",
               address: "",
               country: "",
               zipcode: "",
          })
          setRentalPeriod("", "")
          setEquipments([])

          setCurrentOffer({
               id: "",
               title: "",
               description: "",
               price: "0",
               boatId: "",
               deletedAt: null,
               frequency: 0,
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               location: {
                    city: "",
                    address: "",
                    country: "",
                    zipcode: "",
               },
               rentalPeriod: {
                    start: "",
                    end: "",
               },
               equipments: [],
          })
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <OfferList />
               </SafeAreaView>
               <FAB icon="plus" style={styles.fab} onPress={() => createOffer()} />
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
