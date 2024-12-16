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

export default function SelectBoat() {
     const [boats, setBoatsToSelect] = useState<BoatEntity[]>([])
     const [isLoading, setIsLoading] = useState(true)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const fetchBoats = async () => {
          try {
               const fetchedBoats = await getBoatsUseCase()
               console.log(fetchedBoats)
               setBoatsToSelect(fetchedBoats)
          } catch (error) {
               console.error("Erreur lors de la récupération des bateaux :", error)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchBoats()
     }, [boats])

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
