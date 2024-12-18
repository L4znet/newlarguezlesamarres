import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { Card, Button } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export default function Index() {
     const [isLoading, setIsLoading] = useState(false)
     const { showTranslatedFlashMessage } = useFlashMessage()

     /*  const fetchBoats = async () => {
          try {
               const fetchedBoats = await getBoatsUseCase()
               setBoats(fetchedBoats)
          } catch (error) {
               console.error("Erreur lors de la récupération des bateaux :", error)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchBoats()
     }, [boats])*/

     const renderItem = ({ item }: { item: OfferEntity }) => {
          console.log(item)
          return (
               <Card style={styles.card}>
                    <Card.Title title={""} />
                    <Card.Content>
                         <Text>{""}</Text>
                         <Slideshow images={[]} />
                    </Card.Content>
                    <Card.Actions>
                         <Button onPress={() => console.log("Voir l'offre")}>Voir l'offre</Button>
                    </Card.Actions>
               </Card>
          )
     }

     if (isLoading) {
          return (
               <View style={styles.container}>
                    <Text>Chargement des bateaux...</Text>
               </View>
          )
     }

     if (false) {
          return (
               <View style={styles.container}>
                    <Text>Rien à afficher pour le moment</Text>
                    <FAB icon="plus" style={styles.fab} onPress={() => router.navigate("/(app)/(tabs)/(home)/createOffer")} />
               </View>
          )
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <FlatList data={[]} renderItem={renderItem} keyExtractor={(item) => item.offerId} />
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
