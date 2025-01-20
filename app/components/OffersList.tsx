import React from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useOffers } from "@/modules/hooks/offers/useOffers"
import { useRouter } from "expo-router"
import Slideshow from "@/app/components/Slideshow"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { Offer } from "@/interfaces/Offer"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { displayRentalPeriod } from "@/modules/constants/DisplayRentalPeriod"
import { displayTotalPrice, getHowManyDays } from "@/modules/constants/DisplayTotalPrice"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"

const OffersList = () => {
     const router = useRouter()
     const { data: offers, isPending, error } = useOffers()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          return (
               <View style={styles.container}>
                    <Text>{t("offers_fetch_error")}</Text>
               </View>
          )
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("home_empty_message")}</Text>
               </View>
          )
     }

     const handleMoreDetails = async (offer: Offer) => {
          const session = await getCurrentSessionUseCase()

          router.navigate({
               pathname: "/(app)/(tabs)/(home)/offerDetail",
               params: { offerId: offer.id, userId: session.data.session?.user.id },
          })
     }

     const renderCardItem = ({ item }: ListRenderItemInfo<GetOffersDTO>) => {
          const username = item.profile.username as string
          const boatImages = item.boat.images.map((image) => {
               return {
                    id: image.id as string,
                    url: image.url as string,
                    caption: image.caption as string,
               }
          })

          const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(item.rentalPeriod.start), new Date(item.rentalPeriod.end), locale)
          const { totalAmount } = displayTotalPrice(item.price as string, item?.rentalPeriod as { start: string; end: string })
          const days = getHowManyDays(item.rentalPeriod.start, item.rentalPeriod.end)

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={boatImages} />

                    <Card.Title title={item.title} subtitle={item.description} />

                    <Card.Content>
                         <Text>
                              {t("published_by")} {username}
                         </Text>
                         <Text style={styles.period}>
                              {t("from_date")} {rentalStartDate} {t("to_date").toLowerCase()} {rentalEndDate} ({days} {t("days")})
                         </Text>
                         <Text>
                              {t("price")} : {item.price} {t("money_symbol")} / {t("days")} ({totalAmount} {t("money_symbol")})
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
     period: {
          marginTop: 8,
          color: "#666",
     },
})

export default OffersList
