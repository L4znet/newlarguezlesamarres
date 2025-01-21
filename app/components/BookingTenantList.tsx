import React from "react"
import { FlatList, StyleSheet, View, Text } from "react-native"
import { ActivityIndicator, Button, Card, Chip, useTheme } from "react-native-paper"
import TabsComponent from "./TabsComponent"
import { useTenantBookings } from "@/modules/hooks/bookings/useTenantBookings"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import Slideshow from "@/app/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayTotalPrice } from "@/modules/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/modules/constants/DisplayRentalPeriod"
import { useRouter } from "expo-router"
import { useUpdateBookingStatus } from "@/modules/hooks/bookings/useUpdateBookingStatus"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"

const BookingTenantList = () => {
     const { data: tenantBookings, isPending, error } = useTenantBookings()
     const { mutate: updateBookingStatus, isPending: isPendingUpdate } = useUpdateBookingStatus()
     const theme = useTheme()
     const router = useRouter()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) return <Text style={styles.centered}>Erreur lors de la récupération des données.</Text>

     const handleRentBooking = async (offerId: string, bookingId: string) => {
          router.push({
               pathname: "/(app)/(tabs)/(profile)/tenantBookings/checkout",
               params: {
                    bookingId: bookingId,
                    offerId: offerId,
               },
          })
     }
     const handleCancelBooking = (bookingId: string) => {
          updateBookingStatus({ bookingId, status: "canceled" })
     }

     const filterReservations = (status: string) => tenantBookings.filter((item) => item.status === status)
     const renderCardItem = ({ item }: { item: GetTenantsBookingsDTO }) => {
          const { totalAmount } = displayTotalPrice(item.offerPrice as string, {
               start: item.startDate,
               end: item.endDate,
          })

          const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(item.startDate), new Date(item.endDate), locale, "short")

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.offerTitle} subtitle={item.offerDescription} />
                    <View></View>

                    <Card.Content>
                         <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                              <Chip>{t("booking_" + item.status + "_chip")}</Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Chip style={{ marginRight: 5 }}>
                                   {t("from_date")} {rentalStartDate}
                              </Chip>
                              <Chip>
                                   {t("to_date")} {rentalEndDate}
                              </Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Chip>{item.boatName}</Chip>
                         </View>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                              <Chip>
                                   {totalAmount} {t("money_symbol")}
                              </Chip>
                              <Chip style={{ marginLeft: 10 }}>
                                   {item.offerPrice} {t("money_symbol")}
                              </Chip>
                         </View>
                    </Card.Content>
                    <Card.Actions>
                         <Button mode="contained" style={styles.button} loading={isPendingUpdate} disabled={item.status !== "confirmed" || isPendingUpdate} onPress={() => handleRentBooking(item.offerId as string, item.id as string)}>
                              {t("pay_booking")}
                         </Button>
                         <Button mode="outlined" loading={isPendingUpdate} disabled={item.status === "rented" || item.status === "canceled" || isPendingUpdate} style={styles.button} onPress={() => handleCancelBooking(item.id as string)}>
                              {t("cancel_booking")}
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     const renderTabContent = (data: GetTenantsBookingsDTO[] | [], emptyMessage: string) => <FlatList data={data} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.colors.primary }]}>{emptyMessage}</Text>} />

     return (
          <TabsComponent tabLabels={[t("booking_all_btn"), t("booking_pending_btn"), t("booking_rented_btn"), t("booking_confirmed_btn"), t("booking_canceled_btn"), t("booking_declined_btn")]}>
               {renderTabContent(tenantBookings, t("bookings_tenant_empty_message"))}
               {renderTabContent(filterReservations("pending"), t("bookings_tenant_pending_empty_message"))}
               {renderTabContent(filterReservations("rented"), t("bookings_owner_rented_empty_message"))}
               {renderTabContent(filterReservations("confirmed"), t("bookings_tenant_confirmed_empty_message"))}
               {renderTabContent(filterReservations("canceled"), t("bookings_tenant_canceled_empty_message"))}
               {renderTabContent(filterReservations("declined"), t("bookings_tenant_declined_empty_message"))}
          </TabsComponent>
     )
}

const styles = StyleSheet.create({
     card: {
          marginVertical: 8,
          paddingBottom: 10,
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
     button: {
          marginTop: 16,
     },
})

export default BookingTenantList
