import React from "react"
import { FlatList, StyleSheet, View, Text } from "react-native"
import { ActivityIndicator, Card, Chip, useTheme } from "react-native-paper"
import TabsComponent from "./TabsComponent"
import { useTenantBookings } from "@/modules/hooks/bookings/useTenantBookings"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import Slideshow from "@/modules/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayTotalPrice } from "@/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { displayRentalFrequency } from "@/constants/RentalFrequency"

const BookingTenantList = () => {
     const { data: tenantBookings, isPending, error } = useTenantBookings()
     const theme = useTheme()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) return <Text style={styles.centered}>Erreur lors de la récupération des données.</Text>

     const filterReservations = (status: string) => tenantBookings.filter((item) => item.status === status)

     const formatDate = (date: string) => {
          const dateObj = new Date(date)
          return dateObj.toLocaleDateString()
     }

     const rentalPeriodFormatter = (startDate: string, endDate: string) => {
          const { rentalStartDate, rentalEndDate } = displayRentalPeriod(startDate, endDate)
          return { rentalStartDate, rentalEndDate }
     }

     const renderCardItem = ({ item }: { item: BookingEntity }) => {
          const { totalAmount } = displayTotalPrice(
               item.offerPrice as string,
               {
                    start: item.startDate,
                    end: item.endDate,
               },
               item.offerFrequency
          )

          const { rentalStartDate, rentalEndDate } = rentalPeriodFormatter(item.startDate, item.endDate)

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.offerTitle} subtitle={item.offerDescription} />
                    <View></View>

                    <Card.Content>
                         <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                              <Chip>{item.status === "pending" ? t("booking_pending_chip") : item.status === "confirmed" ? t("booking_confirmed_chip") : t("booking_cancelled_chip")}</Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Chip style={{ marginRight: 5 }}>
                                   {t("from")} {formatDate(item.startDate)}
                              </Chip>
                              <Chip style={{ marginHorizontal: 5 }}>
                                   {t("to")} {formatDate(item.endDate)}
                              </Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Chip>{item.boatName}</Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Text>
                                   {t("booking_price_label")}: {totalAmount} €
                              </Text>
                         </View>
                    </Card.Content>
               </Card>
          )
     }

     const renderTabContent = (data: BookingEntity[], emptyMessage: string) => <FlatList data={data} keyExtractor={(item) => item.id} renderItem={renderCardItem} ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.colors.primary }]}>{emptyMessage}</Text>} />

     return (
          <TabsComponent tabLabels={[t("booking_pending_btn"), t("booking_confirmed_btn"), t("booking_cancelled_btn")]}>
               {renderTabContent(filterReservations("pending"), t("bookings_tenant_pending_empty_message"))}
               {renderTabContent(filterReservations("confirmed"), t("bookings_tenant_confirmed_empty_message"))}
               {renderTabContent(filterReservations("cancelled"), t("bookings_tenant_cancelled_empty_message"))}
          </TabsComponent>
     )
}

const styles = StyleSheet.create({
     card: {
          marginVertical: 8,
     },
     centered: {
          textAlign: "center",
          marginTop: 20,
     },
     emptyMessage: {
          textAlign: "center",
          marginVertical: 20,
          fontSize: 16,
     },
})

export default BookingTenantList
