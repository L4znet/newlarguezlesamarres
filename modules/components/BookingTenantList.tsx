import React from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme, Chip } from "react-native-paper"
import { useRouter } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import { useTenantBookings } from "@/modules/hooks/bookings/useTenantBookings"
import { useOwnerBookings } from "@/modules/hooks/bookings/useOwnerBookings"
import Slideshow from "@/modules/components/Slideshow"

const BookingTenantList = () => {
     const router = useRouter()
     const theme = useTheme()

     const { data: tenantBookings, isPending, error } = useTenantBookings()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          return <Text>{t("bookings_fetch_error")}</Text>
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("bookings_tenant_empty_message")}</Text>
               </View>
          )
     }
     /*
   const handleDeleteOffer = async (offerId: string) => {
       deleteOffer(offerId)
   }*/

     const renderCardItem = ({ item }: ListRenderItemInfo<BookingEntity>) => {
          console.log(item)

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.offerTitle} subtitle={item.offerDescription} />
                    <View></View>

                    <Card.Content>
                         <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                              <Chip onPress={() => console.log("Pressed")}>Pending</Chip>
                         </View>
                         <Text>TOTO</Text>
                         <Text>TATA</Text>
                    </Card.Content>
               </Card>
          )
     }

     return <FlatList ListEmptyComponent={EmptyList} data={tenantBookings} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} />
}

const styles = StyleSheet.create({
     card: {
          width: "100%",
          marginVertical: 10,
     },
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
})

export default BookingTenantList
