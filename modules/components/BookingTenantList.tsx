import React from "react"
import { FlatList, StyleSheet, View, Text } from "react-native"
import { ActivityIndicator, Button, Card, Chip, useTheme } from "react-native-paper"
import TabsComponent from "./TabsComponent"
import { useTenantBookings } from "@/modules/hooks/bookings/useTenantBookings"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import Slideshow from "@/modules/components/Slideshow"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayTotalPrice } from "@/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { useRouter } from "expo-router"
import { useUpdateBookingStatus } from "@/modules/hooks/bookings/useUpdateBookingStatus"

const BookingTenantList = () => {
     const { data: tenantBookings, isPending, error } = useTenantBookings()
     const { mutate: updateBookingStatus } = useUpdateBookingStatus()
     const theme = useTheme()
     const router = useRouter()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) return <Text style={styles.centered}>Erreur lors de la récupération des données.</Text>

     const handleRentBooking = async (offerId: any, bookingId: string) => {
          router.push({
               pathname: "/(app)/(tabs)/(profile)/tenantBookings/checkout",
               params: {
                    bookingId: bookingId,
                    offerId: offerId,
               },
          })
     }

     const handleCancelBooking = (bookingId: string) => {
          updateBookingStatus({ bookingId, status: "cancelled" })
     }

     const filterReservations = (status: string) => tenantBookings.filter((item) => item.status === status)

     const renderCardItem = ({ item }: { item: BookingEntity }) => {
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
                         <Button
                              mode="contained"
                              style={styles.button}
                              disabled={item.status !== "confirmed"}
                              onPress={() =>
                                   handleRentBooking(
                                        {
                                             id: item.offerId,
                                             title: item.offerTitle,
                                             description: item.offerDescription,
                                             price: item.offerPrice,
                                             rentalPeriod: {
                                                  start: item.startDate,
                                                  end: item.endDate,
                                             },
                                             userId: item.userId,
                                        },
                                        item.id as string
                                   )
                              }
                         >
                              {t("pay_booking")}
                         </Button>
                         <Button mode="outlined" disabled={item.status === "rented" || item.status === "cancelled"} style={styles.button} onPress={() => handleCancelBooking(item.id as string)}>
                              {t("cancel_booking")}
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     const renderTabContent = (data: BookingEntity[], emptyMessage: string) => <FlatList data={data} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.colors.primary }]}>{emptyMessage}</Text>} />

     return (
          <TabsComponent tabLabels={[t("booking_all_btn"), t("booking_pending_btn"), t("booking_rented_btn"), t("booking_confirmed_btn"), t("booking_cancelled_btn"), t("booking_declined_btn")]}>
               {renderTabContent(tenantBookings, t("bookings_tenant_empty_message"))}
               {renderTabContent(filterReservations("pending"), t("bookings_tenant_pending_empty_message"))}
               {renderTabContent(filterReservations("rented"), t("bookings_owner_rented_empty_message"))}
               {renderTabContent(filterReservations("confirmed"), t("bookings_tenant_confirmed_empty_message"))}
               {renderTabContent(filterReservations("cancelled"), t("bookings_tenant_cancelled_empty_message"))}
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
