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

     const boatsImages = [
          {
               id: 1,
               boatId: 1,
               url: "https://picsum.photos/700",
          },
          {
               id: 2,
               boatId: 1,
               url: "https://picsum.photos/700",
          },
          {
               id: 3,
               boatId: 2,
               url: "https://picsum.photos/700",
          },
          {
               id: 4,
               boatId: 2,
               url: "https://picsum.photos/700",
          },
          {
               id: 5,
               boatId: 2,
               url: "https://picsum.photos/700",
          },
     ]

     const boats = [
          {
               boatId: 1,
               boatName: "Bateau 1",
               boatDescription: "Description du bateau 1",
               boatCapacity: 1,
               boatType: "Voilier",
               boatImages: boatsImages.filter((image) => image.boatId === 1).map((image) => image.url),
          },
          {
               boatId: 2,
               boatName: "Bateau 2",
               boatDescription: "Description du bateau 2",
               boatCapacity: 2,
               boatType: "Voilier",
               boatImages: boatsImages.filter((image) => image.boatId === 2).map((image) => image.url),
          },
     ]

     const users = [
          {
               id: 1,
               username: "user1",
               email: "test1@test.fr",
               firstName: "User",
               lastName: "One",
          },
          {
               id: 2,
               username: "user2",
               email: "test2@test.fr",
               firstName: "User",
               lastName: "Two",
          },
     ]

     const offers = [
          {
               id: 1,
               boatId: 1,
               boat: boats.find((boat) => boat.boatId === 1),
               offerImages: boatsImages.filter((image) => image.boatId === 1).map((image) => image.url),
               profileId: 1,
               profile: users.find((user) => user.id === 1),
               title: "Offre 1",
               description: "Description de l'offre 1",
               price: 100,
               isAvailable: true,
               frequency: 1,
               equipment: [
                    {
                         id: "1",
                         name: "Equipement 1",
                         description: "Description de l'équipement 1",
                    },
                    {
                         id: "2",
                         name: "Equipement 2",
                         description: "Description de l'équipement 2",
                    },
               ],
               is_skipper_available: true,
               is_team_available: true,
               rental_period: [
                    {
                         from: "2022-01-01",
                         to: "2022-01-02",
                    },
                    {
                         from: "2022-01-03",
                         to: "2022-01-04",
                    },
                    {
                         from: "2022-01-05",
                         to: "2022-01-06",
                    },
               ],
               location: [
                    {
                         city: "Paris",
                         country: "France",
                         address: "1 rue de Paris",
                         zipCode: "75000",
                    },
               ],
          },
          {
               id: 2,
               boatId: 2,
               boat: boats.find((boat) => boat.boatId === 2),
               offerImages: boatsImages.filter((image) => image.boatId === 2).map((image) => image.url),
               profileId: 2,
               profile: users.find((user) => user.id === 2),
               title: "Offre 2",
               description: "Description de l'offre 2",
               price: 200,
               isAvailable: true,
               frequency: 2,
               equipment: [
                    {
                         id: "3",
                         name: "Equipement 3",
                         description: "Description de l'équipement 3",
                    },
                    {
                         id: "4",
                         name: "Equipement 4",
                         description: "Description de l'équipement 4",
                    },
               ],
               is_skipper_available: true,
               is_team_available: true,
               rental_period: [
                    {
                         from: "2022-02-01",
                         to: "2022-02-02",
                    },
                    {
                         from: "2022-02-03",
                         to: "2022-02-04",
                    },
                    {
                         from: "2022-02-05",
                         to: "2022-02-06",
                    },
               ],
               location: [
                    {
                         city: "Lyon",
                         country: "France",
                         address: "1 rue de Lyon",
                         zipCode: "69000",
                    },
               ],
          },
          {
               id: 3,
               boatId: 2,
               boat: boats.find((boat) => boat.boatId === 2),
               offerImages: boatsImages.filter((image) => image.boatId === 2).map((image) => image.url),
               profileId: 2,
               profile: users.find((user) => user.id === 2),
               title: "Offre 3",
               description: "Description de l'offre 3",
               price: 300,
               isAvailable: true,
               frequency: 3,
               equipment: [
                    {
                         id: "5",
                         name: "Equipement 5",
                         description: "Description de l'équipement 5",
                    },
                    {
                         id: "6",
                         name: "Equipement 6",
                         description: "Description de l'équipement 6",
                    },
               ],
               is_skipper_available: true,
               is_team_available: true,
               rental_period: [
                    {
                         from: "2022-03-01",
                         to: "2022-03-02",
                    },
                    {
                         from: "2022-03-03",
                         to: "2022-03-04",
                    },
                    {
                         from: "2022-03-05",
                         to: "2022-03-06",
                    },
               ],
               location: [
                    {
                         city: "Marseille",
                         country: "France",
                         address: "1 rue de Marseille",
                         zipCode: "13000",
                    },
               ],
          },
     ]

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
               <Card key={item.id} style={styles.card}>
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
                    <FlatList data={offers} renderItem={renderItem} keyExtractor={(item) => item.id} />
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
