import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import supabase from "@/supabaseClient"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import Slideshow from "@/modules/components/Slideshow"
import { Card, Button } from "react-native-paper"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export default function Index() {
     const [boats, setBoats] = useState<BoatEntity[]>([])
     const [isLoading, setIsLoading] = useState(true)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const fetchBoats = async () => {
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
     }, [boats])

     const renderItem = ({ item }: { item: BoatEntity }) => {
          return (
               <Card key={item.boatId} style={styles.card}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    <Card.Content>
                         <Text>ID : {item.boatId}</Text>
                         <Text>Capacité : {item.boatCapacity}</Text>
                         <Text>Type : {item.boatType}</Text>
                    </Card.Content>
                    <Card.Actions>
                         <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: item.boatId } })}>Modifier</Button>
                         <Button onPress={async () => await deleteBoatUseCase(item.boatId, showTranslatedFlashMessage)}>Supprimer</Button>
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

     if (boats.length === 0) {
          return (
               <View style={styles.container}>
                    <Text>Rien à afficher pour le moment</Text>
                    <FAB icon="plus" style={styles.fab} onPress={() => router.navigate("/(app)/(tabs)/(boats)/createBoat")} />
               </View>
          )
     }

     const boatsList = () => {
          return <FlatList data={boats} renderItem={renderItem} keyExtractor={(item) => item.boatId} />
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <FlatList data={boats} renderItem={renderItem} keyExtractor={(item) => item.boatId} />
               </SafeAreaView>
               <FAB icon="plus" style={styles.fab} onPress={() => router.navigate("/(app)/(tabs)/(boats)/addBoat")} />
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
