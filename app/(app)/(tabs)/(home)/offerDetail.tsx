import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import Slideshow from "@/modules/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { useOfferById } from "@/modules/hooks/offers/useOfferById"
import { useCreateBooking } from "@/modules/hooks/bookings/useCreateBooking"
import { useIsOfferReserved } from "@/modules/hooks/bookings/useIsOfferReserved"
import { useHasUserReservedOffer } from "@/modules/hooks/bookings/useHasUserReservedOffer"
import { displayTotalPrice, getHowManyDays } from "@/constants/DisplayTotalPrice"

export default function OfferDetail() {
     const { offerId, userId } = useLocalSearchParams<{ offerId: string; userId: string }>()
     const { data: offerById, isPending, error } = useOfferById(offerId)
     const createBooking = useCreateBooking()
     const { data: isOfferReserved, isPending: isPendingIsOfferReserved, error: errorIsOfferReserved } = useIsOfferReserved(offerId)
     const { data: hasUserReservedOffer, isPending: isPendingHasUserReservedOffer, error: errorHasUserReservedOffer } = useHasUserReservedOffer(offerId, userId)

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) {
          return <ActivityIndicator size="large" />
     }

     const handleBookOffer = async () => {
          if (!userId) {
               throw new Error("User session not found.")
          }

          createBooking.mutate({
               offerId: offerById?.id as string,
               userId: userId,
               startDate: offerById?.rentalPeriod.start as string,
               endDate: offerById?.rentalPeriod.end as string,
               status: "pending",
          })
     }

     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(offerById?.rentalPeriod.start as string), new Date(offerById?.rentalPeriod.end as string), locale)
     const { totalAmount } = displayTotalPrice(offerById?.price as string, offerById?.rentalPeriod as { start: string; end: string })
     const days = getHowManyDays(offerById?.rentalPeriod.start as string, offerById?.rentalPeriod.end as string)

     const getBoatsImages = () => {
          const boatsImages = [] as { id: string; caption: string; url: string }[]

          offerById?.boats?.boatImages.forEach((boatImage) => {
               boatsImages.push({
                    id: boatImage.id as string,
                    caption: boatImage.caption as string,
                    url: boatImage.url as string,
               })
          })

          return boatsImages
     }

     const boatImages = getBoatsImages()

     return (
          <View style={styles.container}>
               <Slideshow images={boatImages} />
               <Text variant="headlineLarge" style={styles.title}>
                    {offerById?.title}
               </Text>
               <Text variant="bodyLarge" style={styles.description}>
                    {offerById?.description}
               </Text>
               <Text style={styles.period}>
                    {t("from_date")} {rentalStartDate} {t("to_date").toLowerCase()} {rentalEndDate} ({days} {t("days")})
               </Text>
               <Text style={styles.price}>
                    {offerById?.price} {t("money_symbol")} / {t("days")} ({totalAmount} {t("money_symbol")})
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
