import React from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useOffers } from "@/modules/hooks/offers/useOffers"
import { useRouter } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { useDeleteOffer } from "@/modules/hooks/offers/useDeleteOffer"
import { displayRentalFrequency, getRentalFrequency, RentalFrequency } from "@/constants/RentalFrequency"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

const OfferList = () => {
     const router = useRouter()
     console.log("JE SUIS LAAAA OFFERLIST")
     const { data: offers, isPending, error } = useOffers()
     const deleteOffer = useDeleteOffer()
     const theme = useTheme()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const { setCurrentOffer } = useOfferExternalScreenStore()

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          console.error("Erreur lors de la récupération des offres :", error)
          return <Text>Erreur lors de la récupération des offres</Text>
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>Rien à afficher pour le moment</Text>
               </View>
          )
     }

     const handleSelectOffer = (offer: any) => {
          setCurrentOffer(offer)
          router.navigate("/(app)/(tabs)/(home)/editOffer")
     }

     return (
          <FlatList
               ListEmptyComponent={EmptyList}
               data={offers}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => {
                    const frequency = displayRentalFrequency(getRentalFrequency(item.frequency as unknown as RentalFrequency), locale)

                    return (
                         <Card key={item.id} style={[styles.card]}>
                              <Slideshow images={item.boats.boatImages.map((img: any) => ({ url: img.url, caption: img.caption || "Image" }))} />

                              <Card.Title title={item.title} subtitle={item.description} />

                              <Card.Content>
                                   <Text>Publié par : {item.profiles.username}</Text>
                                   <Text>
                                        Prix : {item.price} € / {frequency}
                                   </Text>
                              </Card.Content>

                              <Card.Actions>
                                   <Button onPress={() => handleSelectOffer(item)}>Modifier</Button>
                                   <Button mode="contained" onPress={() => deleteOffer.mutate(item.id)} loading={deleteOffer.isPending} disabled={deleteOffer.isPending}>
                                        Supprimer
                                   </Button>
                              </Card.Actions>
                         </Card>
                    )
               }}
          />
     )
}

const styles = StyleSheet.create({
     card: {
          width: "100%",
          marginVertical: 10,
     },
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
})

export default OfferList
