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
import { useOwnerBookings } from "@/modules/hooks/bookings/useOwnerBookings"
import { useUpdateBookingStatus } from "@/modules/hooks/bookings/useUpdateBookingStatus"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"

const BookingTenantList = () => {
     const { data: ownerBookings, isPending, error } = useOwnerBookings()
     const { mutate: updateBookingStatus } = useUpdateBookingStatus()

     const handleBookingDecline = (bookingId: string) => {
          updateBookingStatus({ bookingId, status: "declined" })
     }

     const handleBookingConfirm = (bookingId: string) => {
          updateBookingStatus({ bookingId, status: "confirmed" })
     }

     const theme = useTheme()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (!ownerBookings && isPending) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("a_moment_title")}</Text>
               </View>
          )
     }

     if (!ownerBookings) {
          return null
     }

     const filterReservations = (status: string) => ownerBookings.filter((item) => item.status === status)

     const renderCardItem = ({
          item,
     }: {
          item: {
               id: string
               offerTitle: string
               status: string
               startDate: string
               endDate: string
               boatName: string
               profileFirstname: string
               profileLastname: string
               offerPrice: string
               boatImages: { id: string; caption: string; url: string }[]
          }
     }) => {
          const { totalAmount } = displayTotalPrice(item.offerPrice as string, {
               start: item.startDate,
               end: item.endDate,
          })

          const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(item.startDate), new Date(item.endDate), locale, "short")

          if (!item.id) {
               return null
          }
          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.offerTitle} subtitle={"Réservé par " + item.profileFirstname + " " + item.profileLastname} />
                    <Card.Content>
                         <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
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
                                   {item.offerPrice} {t("money_symbol")} / {t("days")}
                              </Chip>
                         </View>
                    </Card.Content>

                    <Card.Actions>
                         <Button mode={"outlined"} disabled={item.status !== "pending"} onPress={() => handleBookingDecline(item.id as string)}>
                              {t("booking_decline_btn")}
                         </Button>
                         <Button mode={"contained"} disabled={item.status !== "pending"} onPress={() => handleBookingConfirm(item.id as string)}>
                              {t("booking_confirm_btn")}
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     const renderTabContent = (data: GetOwnerBookingsDTO[] | undefined, emptyMessage: string) => <FlatList data={data} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.colors.primary }]}>{emptyMessage}</Text>} />

     return (
          <TabsComponent tabLabels={[t("booking_all_btn"), t("booking_pending_btn"), t("booking_rented_btn"), t("booking_confirmed_btn"), t("booking_cancelled_btn"), t("booking_declined_btn")]}>
               {renderTabContent(ownerBookings, t("bookings_owner_empty_message"))}
               {renderTabContent(filterReservations("pending"), t("bookings_owner_pending_empty_message"))}
               {renderTabContent(filterReservations("rented"), t("bookings_owner_rented_empty_message"))}
               {renderTabContent(filterReservations("confirmed"), t("bookings_owner_confirmed_empty_message"))}
               {renderTabContent(filterReservations("cancelled"), t("bookings_owner_cancelled_empty_message"))}
               {renderTabContent(filterReservations("declined"), t("bookings_owner_declined_empty_message"))}
          </TabsComponent>
     )
}

const styles = StyleSheet.create({
     card: {
          marginVertical: 20,
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
     container: {
          flex: 1,
          width: "90%",
          alignSelf: "center",
     },
})

export default BookingTenantList
