import { FlatList, SafeAreaView, StyleSheet, View } from "react-native"
import { Button, Card, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import Slideshow from "@/modules/components/Slideshow"
import { router } from "expo-router"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useBoatStore, useRealtimeBoats } from "@/modules/stores/boatStore"

export default function SelectBoat() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     console.log("RENDER SELECT BOAT")

     const { boats, fetchBoats, isLoading, error } = useBoatStore()

     useRealtimeBoats()

     useEffect(() => {
          fetchBoats()
     }, [fetchBoats])

     const renderItem = ({ item }: { item: BoatEntity }) => {
          return (
               <Card key={item.boatId} style={styles.card}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    <Card.Actions>
                         <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: item.boatId } })}>Modifier</Button>
                         <Button onPress={async () => await deleteBoatUseCase(item.boatId, showTranslatedFlashMessage)}>Supprimer</Button>
                    </Card.Actions>
               </Card>
          )
     }

     return (
          <View style={styles.container}>
               <Text variant={"titleLarge"}>Modal screen</Text>
               <SafeAreaView style={styles.safeView}>
                    <FlatList data={boats} renderItem={renderItem} keyExtractor={(item) => item.boatId} />
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
     },
     card: {
          width: "100%",
          marginBottom: 20,
     },
})
