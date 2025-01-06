import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import Slideshow from "@/modules/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useOfferById } from "@/modules/hooks/offers/useOfferById"
import { useCreateBooking } from "@/modules/hooks/bookings/useCreateBooking"
import { useIsOfferReserved } from "@/modules/hooks/bookings/useIsOfferReserved"
import { useHasUserReservedOffer } from "@/modules/hooks/bookings/useHasUserReservedOffer"

export default function OfferDetail() {
     const { offerId, userId } = useLocalSearchParams<{ offerId: string; userId: string }>()
     const { currentOffer, setCurrentOffer } = useOfferStore()
     const { data: offerById, isPending, error } = useOfferById(offerId)

     const createBooking = useCreateBooking()
     const { data: isOfferReserved, isPending: isPendingIsOfferReserved, error: errorIsOfferReserved } = useIsOfferReserved(offerId)
     const { data: hasUserReservedOffer, isPending: isPendingHasUserReservedOffer, error: errorHasUserReservedOffer } = useHasUserReservedOffer(offerId, userId)

     interface BoatImage {
          id: string
          url: string
          caption: string | null
     }

     useEffect(() => {
          if (offerId && offerById && !isPending && !error) {
               const fetchOffer = async () => {
                    await setCurrentOffer(offerById)
               }
               fetchOffer()
          }
     }, [offerById])

     if (!currentOffer) {
          return <ActivityIndicator size="large" />
     }

     const handleBookOffer = async () => {
          if (!userId) {
               throw new Error("User session not found.")
          }

          createBooking.mutate({
               offerId: currentOffer.id as string,
               userId: userId,
               startDate: currentOffer.rentalPeriod.start,
               endDate: currentOffer.rentalPeriod.end,
               status: "pending",
          })
     }
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(currentOffer.rentalPeriod.start, currentOffer.rentalPeriod.end, locale)

     const getBoatsImages = () => {
          const boatsImages = [] as { id: string; caption: string; url: string }[]

          offerById?.boats?.boatImages.forEach((boatImage) => {
               boatsImages.push({
                    id: boatImage.id as string,
                    caption: boatImage.caption as string,
                    url: boatImage.url as string,
               })
          })

          return boatsImages as BoatImage[]
     }

     let boatImages = getBoatsImages()

     return (
          <View style={styles.container}>
               <Slideshow images={boatImages} />
               <Text variant="headlineLarge" style={styles.title}>
                    {currentOffer.title}
               </Text>
               <Text variant="bodyLarge" style={styles.description}>
                    {currentOffer.description}
               </Text>
               <Text style={styles.period}>
                    {t("from_date")} {rentalStartDate} {t("to_date").toLowerCase()} {rentalEndDate}
               </Text>
               <Text style={styles.price}>
                    {currentOffer.price} {t("money_symbol")}
               </Text>
               <Button mode="contained" style={styles.button} onPress={handleBookOffer} disabled={hasUserReservedOffer || isOfferReserved}>
                    {hasUserReservedOffer ? t("already_reserved") : t("book_offer")}
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
