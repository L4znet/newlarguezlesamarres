import React from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useRouter } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { displayRentalFrequency, getRentalFrequency } from "@/constants/RentalFrequency"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useOfferStore } from "@/modules/stores/offerStore"
import { Offer } from "@/interfaces/Offer"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { useDeleteOffer } from "@/modules/hooks/offers/useDeleteOffer"
import { useOwnOffers } from "@/modules/hooks/offers/useOwnOffers"

const OwnOffersList = () => {
     const router = useRouter()
     const { data: offers, isPending, error } = useOwnOffers()
     const { mutate: deleteOffer, isPending: isDeleting, error: deleteError } = useDeleteOffer()
     const theme = useTheme()

     const { setOfferField, setEquipments, setRentalPeriod, setLocation, selectBoat } = useOfferStore()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          return <Text>{t("offers_fetch_error")}</Text>
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("offers_empty_message")}</Text>
               </View>
          )
     }

     const handleDeleteOffer = async (offerId: string) => {
          deleteOffer(offerId)
     }

     const handleUpdateOffer = async (offer: Offer) => {
          setOfferField({
               id: offer.id,
               title: offer.title,
               description: offer.description,
               price: offer.price,
               frequency: offer.frequency,
               isAvailable: offer.isAvailable,
               isSkipperAvailable: offer.isSkipperAvailable,
               isTeamAvailable: offer.isTeamAvailable,
               boatId: offer.boatId,
          })

          setEquipments(offer.equipments)
          setRentalPeriod(offer.rentalPeriod.start, offer.rentalPeriod.end)
          setLocation(offer.location)
          selectBoat(offer.boatId)

          router.navigate({
               pathname: "/(app)/(tabs)/(home)/editOffer",
          })
     }

     const renderCardItem = ({ item }: ListRenderItemInfo<OfferEntity>) => {
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
                         <Text>
                              {t("published_by")} : {username}
                         </Text>
                         <Text>
                              {t("price")} : {item.price} {t("money_symbol")} / {frequency}
                         </Text>
                    </Card.Content>

                    <Card.Actions>
                         <Button mode="contained" onPress={() => handleUpdateOffer(item)}>
                              {t("edit")}
                         </Button>
                         <Button mode="outlined" loading={isDeleting} disabled={isDeleting} onPress={() => handleDeleteOffer(item.id as string)}>
                              {t("delete")}
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

export default OwnOffersList
