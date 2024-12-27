import React from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useOffers } from "@/modules/hooks/offers/useOffers"
import { useRouter } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { displayRentalFrequency, getRentalFrequency, RentalFrequency } from "@/constants/RentalFrequency"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useOfferStore } from "@/modules/stores/offerStore"
import { Offer } from "@/interfaces/Offer"

const OfferList = () => {
     const router = useRouter()
     const { data: offers, isPending, error } = useOffers()
     const theme = useTheme()

     const { setOfferField, setEquipments, setRentalPeriod, setLocation, selectBoat } = useOfferStore()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

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

     const handleMoreDetails = (offer: Offer) => {
          router.navigate({
               pathname: "/(app)/(tabs)/(home)/offerDetail",
               params: { offerId: offer.id },
          })
     }

     const handleUpdateOffer = async (offer: Offer) => {
          console.log({
               id: offer.id,
               title: offer.title,
               description: offer.description,
               price: offer.price,
               frequency: getRentalFrequency(offer.frequency.toString()),
               isAvailable: offer.isAvailable,
               isSkipperAvailable: offer.isSkipperAvailable,
               isTeamAvailable: offer.isTeamAvailable,
               boatId: offer.boatId,
          })
          setOfferField("id", offer.id)
          setOfferField("title", offer.title)
          setOfferField("description", offer.description)
          setOfferField("price", offer.price)
          setOfferField("frequency", offer.frequency.toString())
          setOfferField("isAvailable", offer.isAvailable)
          setOfferField("isSkipperAvailable", offer.isSkipperAvailable)
          setOfferField("isTeamAvailable", offer.isTeamAvailable)

          setEquipments(offer.equipments)
          setRentalPeriod(offer.rentalPeriod.start, offer.rentalPeriod.end)
          setLocation(offer.location)
          selectBoat(offer.boatId)

          router.navigate({
               pathname: "/(app)/(tabs)/(home)/editOffer",
          })
     }

     return (
          <FlatList
               ListEmptyComponent={EmptyList}
               data={offers}
               keyExtractor={(item) => item.id as string}
               renderItem={({ item }) => {
                    const frequency = displayRentalFrequency(item.frequency.toString(), locale)
                    const username = item?.profiles?.username as string
                    const boatImages = item?.boats?.boatImages as unknown as [
                         {
                              url: string
                              caption: string
                         },
                    ]

                    return (
                         <Card key={item.id} style={[styles.card]}>
                              <Slideshow images={boatImages.map((img: any) => ({ url: img.url, caption: img.caption || "Image" }))} />

                              <Card.Title title={item.title} subtitle={item.description} />

                              <Card.Content>
                                   <Text>Publié par : {username}</Text>
                                   <Text>
                                        Prix : {item.price} € / {frequency}
                                   </Text>
                              </Card.Content>

                              <Card.Actions>
                                   <Button mode="contained" onPress={() => handleUpdateOffer(item)}>
                                        Modifier
                                   </Button>
                                   <Button mode="contained" onPress={() => handleMoreDetails(item)}>
                                        Voir plus de détails
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
