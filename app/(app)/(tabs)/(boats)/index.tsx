import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { AnimatedFAB, Button, Card, FAB, Text } from "react-native-paper"
import React, { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { router } from "expo-router"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import Slideshow from "@/modules/components/Slideshow"

export default function index() {
     const [boats, setBoats] = useState({})
     const [isLoading, setIsLoading] = useState(true)

     useEffect(() => {
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

          fetchBoats()
     }, [boats])

     if (isLoading) {
          return (
               <View style={styles.container}>
                    <Text>Chargement des bateaux...</Text>
               </View>
          )
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         {boats.map((boat: { boatId: string; boatName: string | number | boolean; boatDescription: string | number | boolean; boatCapacity: string | number | boolean; boatType: string | number | boolean }) => {
                              return (
                                   <Card key={boat.boatId} style={styles.card}>
                                        <Slideshow images={boat.boatImages} />
                                        <Card.Title title={boat.boatName} subtitle={boat.boatDescription} />
                                        <Card.Content>
                                             <Text>ID : {boat.boatId}</Text>
                                             <Text>Capacité : {boat.boatCapacity}</Text>
                                             <Text>Type : {boat.boatType}</Text>
                                        </Card.Content>
                                        <Card.Actions>
                                             <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: boat.boatId } })}>Modifier</Button>
                                             <Button onPress={() => router.navigate({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: boat.boatId } })}>Supprimer</Button>
                                        </Card.Actions>
                                   </Card>
                              )
                         })}
                    </ScrollView>
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
     scrollViewBoats: {
          width: "90%",
          rowGap: 20,
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
