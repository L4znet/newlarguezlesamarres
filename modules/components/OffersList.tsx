import React from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useOffers } from "@/modules/hooks/offers/useOffers"
import { useRouter } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { displayRentalFrequency, getRentalFrequency, RentalFrequency } from "@/constants/RentalFrequency"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useOfferStore } from "@/modules/stores/offerStore"
import { Offer } from "@/interfaces/Offer"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

const OffersList = () => {
     const router = useRouter()
     const { data: offers, isPending, error } = useOffers()
     const theme = useTheme()

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

     const handleMoreDetails = async (offer: Offer) => {
          const session = await getCurrentSessionUseCase()
          const userId = session.data.session?.user.id

          router.navigate({
               pathname: "/(app)/(tabs)/(home)/offerDetail",
               params: { offerId: offer.id, userId: userId },
          })
     }

     const renderCardItem = ({ item }: ListRenderItemInfo<OfferEntity>) => {
          const frequency = displayRentalFrequency(item.frequency.toString(), locale)
          const username = item?.profiles?.username as string
          const boatImages = item?.boats?.boatImages?.map((image) => {
               return {
                    id: image.id as string,
                    url: image.url as string,
                    caption: image.caption as string,
               }
          })

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={boatImages} />

                    <Card.Title title={item.title} subtitle={item.description} />

                    <Card.Content>
                         <Text>
                              {t("published_by")} {username}
                         </Text>
                         <Text>
                              {t("price")} : {item.price} {t("money_symbol")} / {frequency}
                         </Text>
                    </Card.Content>

                    <Card.Actions>
                         <Button mode="contained" onPress={() => handleMoreDetails(item)}>
                              {t("moreDetails")}
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     return <FlatList ListEmptyComponent={EmptyList} data={offers} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} />
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

export default OffersList
