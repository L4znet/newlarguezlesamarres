import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import OffersList from "@/modules/components/OffersList"
import { useOfferStore } from "@/modules/stores/offerStore"

export default function Index() {
     const [isLoading, setIsLoading] = useState(false)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const { setRentalPeriod, setLocation, setEquipments, setCurrentOffer } = useOfferStore()

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

          await setCurrentOffer({
               id: "",
               title: "",
               description: "",
               price: "0",
               boatId: "",
               frequency: 0,
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
          })
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <OffersList />
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
