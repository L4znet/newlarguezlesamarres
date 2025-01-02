import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import Slideshow from "@/modules/components/Slideshow"
import { displayRentalFrequency } from "@/constants/RentalFrequency"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"

export default function OfferDetail() {
     const { offerId } = useLocalSearchParams<{ offerId: string }>()
     const { currentOffer, setCurrentOffer } = useOfferStore()

     useEffect(() => {
          if (offerId) {
               const fetchOffer = async () => {
                    const offer = await getSingleOfferUseCase(offerId)

                    await setCurrentOffer(offer)
               }
               fetchOffer()
          }
     }, [offerId])

     if (!currentOffer) {
          return <ActivityIndicator size="large" />
     }

     const { title, rentalPeriod, price, frequency, description } = currentOffer

     const handleRentOffer = () => {
          router.push({
               pathname: "/(app)/(tabs)/(home)/checkout",
          })
     }

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const frequencyParsed = displayRentalFrequency(frequency.toString(), locale)
     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(rentalPeriod.start, rentalPeriod.end)

     return (
          <View style={styles.container}>
               <Slideshow images={currentOffer.boatImages} />
               <Text variant="headlineLarge" style={styles.title}>
                    {title}
               </Text>
               <Text variant="bodyLarge" style={styles.description}>
                    {description}
               </Text>
               <Text style={styles.period}>
                    {t("from_date")} {rentalStartDate} {t("to_date").toLowerCase()} {rentalEndDate}
               </Text>
               <Text style={styles.price}>
                    {price} {t("money_symbol")} / {frequencyParsed.toLowerCase()}
               </Text>
               <Button mode="contained" style={styles.button} onPress={handleRentOffer}>
                    {t("continue_to_payment")}
               </Button>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 16,
     },
     title: {
          marginBottom: 8,
          fontWeight: "bold",
     },
     description: {
          marginBottom: 16,
     },
     period: {
          marginBottom: 8,
          color: "#666",
     },
     price: {
          marginBottom: 16,
          fontSize: 16,
          fontWeight: "bold",
     },
     button: {
          marginTop: 16,
     },
     loadingText: {
          flex: 1,
          textAlign: "center",
          marginTop: 20,
     },
})
