import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import Slideshow from "@/modules/components/Slideshow"

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

     console.log(currentOffer)

     if (!currentOffer) {
          return <Text style={styles.loadingText}>Loading...</Text>
     }

     const { title, rentalPeriod, price, frequency, description } = currentOffer

     const convertAmountForStripe = (amount: number) => amount * 100

     const getHowManyDays = (start: string, end: string) => {
          const startDate = new Date(start)
          const endDate = new Date(end)
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
     }

     const handleRentOffer = () => {
          let amount = 0

          if (frequency === 0) {
               const startDate = new Date(rentalPeriod.start)
               const endDate = new Date(rentalPeriod.end)
               const diffHours = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
               amount = convertAmountForStripe(diffHours * parseInt(price))
          } else {
               const days = getHowManyDays(rentalPeriod.start, rentalPeriod.end)
               amount = convertAmountForStripe(days * parseInt(price))
          }

          router.push({
               pathname: "/(app)/(tabs)/(home)/checkout",
               params: { amount, offerId },
          })
     }

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
                    Rental Period: {rentalPeriod.start} to {rentalPeriod.end}
               </Text>
               <Text style={styles.price}>Price: ${price}</Text>
               <Button mode="contained" style={styles.button} onPress={handleRentOffer}>
                    Proceed to Payment
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
