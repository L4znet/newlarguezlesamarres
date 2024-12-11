import { SafeAreaView, FlatList, StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import supabase from "@/supabaseClient"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import Slideshow from "@/modules/components/Slideshow"
import { Card, Button } from "react-native-paper"

export default function Index() {
     const [boats, setBoats] = useState<BoatEntity[]>([])
     const [isLoading, setIsLoading] = useState(true)

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

     const handleRealtimeChanges = (payload: any) => {
          const { eventType, new: newBoat, old: oldBoat } = payload

          setBoats((prev) => {
               switch (eventType) {
                    case "INSERT":
                         return prev.some((boat) => boat.boatId === newBoat.id) ? prev : [...prev, BoatEntity.fromSupabaseData(newBoat)]
                    case "UPDATE":
                         return prev.map((boat) => (boat.boatId === newBoat.id ? BoatEntity.fromSupabaseData(newBoat) : boat))
                    case "DELETE":
                         return prev.filter((boat) => boat.boatId !== oldBoat.id)
                    default:
                         return prev
               }
          })
     }

     useEffect(() => {
          fetchBoats()

          const subscription = supabase
               .channel("boats-changes")
               .on(
                    "postgres_changes",
                    {
                         event: "*",
                         schema: "public",
                         table: "boats",
                    },
                    (payload) => {
                         handleRealtimeChanges(payload)
                    }
               )
               .subscribe()

          return () => {
               supabase.removeChannel(subscription)
          }
     }, [])

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
