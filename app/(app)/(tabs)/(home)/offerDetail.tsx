import React, { useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import Slideshow from "@/app/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalPeriod } from "@/modules/constants/DisplayRentalPeriod"
import { useOfferById } from "@/modules/hooks/offers/useOfferById"
import { useCreateBooking } from "@/modules/hooks/bookings/useCreateBooking"
import { useIsOfferReserved } from "@/modules/hooks/bookings/useIsOfferReserved"
import { useBookingStatus } from "@/modules/hooks/bookings/useBookingStatus"
import { displayTotalPrice, getHowManyDays } from "@/modules/constants/DisplayTotalPrice"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { GetBookingStatusDTO } from "@/modules/domain/bookings/DTO/GetBookingStatusDTO"

export default function OfferDetail() {
     const { offerId, userId } = useLocalSearchParams<{ offerId: string; userId: string }>()
     const { data: offerById, isPending, error } = useOfferById(offerId)
     const createBooking = useCreateBooking()
     const { data: bookingsStatus, isPending: isPendingBookingStatus, error: errorIsOfferReserved } = useBookingStatus(offerId)

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending || isPendingBookingStatus) {
          return <ActivityIndicator size="large" />
     }

     const hasUserReservedOffer = bookingsStatus?.some((booking) => {
          const bookingStatusDTO = new GetBookingStatusDTO(booking.status, booking.offerId, booking.userId)
          return bookingStatusDTO.hasUserReserved(userId)
     })

     const isOfferReserved = bookingsStatus?.some((booking) => {
          const bookingStatusDTO = new GetBookingStatusDTO(booking.status, booking.offerId, booking.userId)
          return bookingStatusDTO.isFullyReserved()
     })

     const handleBookOffer = async () => {
          createBooking.mutate({
               offerId: offerById?.id as string,
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

          offerById?.boat?.images.forEach((boatImage) => {
               boatsImages.push({
                    id: boatImage.id as string,
                    caption: boatImage.caption as string,
                    url: boatImage.url as string,
               })
          })

          return boatsImages
     }

     const boatImages = getBoatsImages()

     console.log("hasUserReservedOffer", hasUserReservedOffer)
     console.log("isOfferReserved", isOfferReserved)

     return (
          <ScrollView style={styles.container}>
               <Slideshow images={boatImages} />
               <Text variant="headlineLarge" style={styles.title}>
                    {offerById?.title}
               </Text>

               <Text style={styles.description}>{offerById?.description}</Text>
               <Text variant={"headlineMedium"}> {t("equipments_title")} :</Text>
               {!offerById?.equipments ? (
                    <View>
                         {offerById?.equipments?.map((equipment, index) => (
                              <Text key={index} style={styles.equipmentItem}>
                                   {equipment.equipmentName} - {equipment.equipmentQuantity}
                              </Text>
                         ))}
                    </View>
               ) : (
                    <Text style={styles.equipmentItem}>{t("no_equipments")}</Text>
               )}

               <Text style={styles.period}>
                    {t("from_date")} {rentalStartDate} {t("to_date").toLowerCase()} {rentalEndDate} ({days} {t("days")})
               </Text>
               <Text variant={"headlineMedium"}> {t("price_title")} :</Text>
               <Text style={styles.price}>
                    {offerById?.price} {t("money_symbol")} / {t("days")} ({totalAmount} {t("money_symbol")})
               </Text>
               <Button mode="contained" style={styles.button} onPress={handleBookOffer} disabled={hasUserReservedOffer || isOfferReserved}>
                    {hasUserReservedOffer ? t("already_reserved") : t("book_offer")}
               </Button>
          </ScrollView>
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
     equipmentItem: {
          marginBottom: 8,
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
