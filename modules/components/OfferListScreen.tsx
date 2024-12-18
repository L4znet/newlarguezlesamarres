import React from "react"
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Text, ActivityIndicator, Card, Button } from "react-native-paper"
import { useOffers } from "@/modules/hooks/offers/useOffers"
import { router, useRouter } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"

const OfferListScreen = () => {
     const { data: offers, isPending, error } = useOffers()
     const router = useRouter()

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          console.error("Erreur lors de la récupération des offres :", error)
          return <Text>Erreur lors de la récupération des offres</Text>
     }

     return (
          <FlatList
               data={offers}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => {
                    return (
                         <Card key={item.boatId} style={styles.card}>
                              <Slideshow images={item.boats.boat_images} />
                              <Card.Title title={item.title} subtitle={item.description} />

                              <Card.Content>
                                   <Text>Publié par {item.profiles.username}</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: item.boatId } })}>Modifier</Button>
                                   <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: item.boatId } })}>Modifier</Button>
                              </Card.Actions>
                         </Card>
                    )
               }}
          />
     )
}

const styles = StyleSheet.create({
     item: {
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
     },

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
export default OfferListScreen
