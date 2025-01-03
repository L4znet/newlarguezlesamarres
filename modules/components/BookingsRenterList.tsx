import React from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme } from "react-native-paper"
import { useRouter } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { useTenantBookings } from "@/modules/hooks/bookings/useTenantBookings"
import { useOwnerBookings } from "@/modules/hooks/bookings/useOwnerBookings"

const BookingsRenterList = () => {
     const router = useRouter()
     const theme = useTheme()

     const { data: ownerBookings, isPending, error } = useOwnerBookings()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          return <Text>{t("offers_fetch_error")}</Text>
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("bookings_renter_empty_message")}</Text>
               </View>
          )
     }
     /*
    const handleDeleteOffer = async (offerId: string) => {
        deleteOffer(offerId)
    }*/

     const renderCardItem = ({ item }: ListRenderItemInfo<BookingEntity>) => {
          return (
               <Card key={item.id} style={[styles.card]}>
                    <Card.Content>
                         <Text>TOTO</Text>
                         <Text>TATA</Text>
                    </Card.Content>
               </Card>
          )
     }

     return <FlatList contentContainerStyle={styles.container} ListEmptyComponent={EmptyList} data={ownerBookings} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} />
}

const styles = StyleSheet.create({
     card: {
          width: "100%",
          marginVertical: 10,
     },
     container: {
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
     },
})

export default BookingsRenterList