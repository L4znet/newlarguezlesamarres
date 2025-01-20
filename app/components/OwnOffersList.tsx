import React, { useState } from "react"
import { View, FlatList, StyleSheet, ListRenderItemInfo } from "react-native"
import { Text, ActivityIndicator, Card, Button, useTheme, Portal, Modal } from "react-native-paper"
import { useRouter } from "expo-router"
import Slideshow from "@/app/components/Slideshow"

import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { Offer } from "@/interfaces/Offer"
import { useDeleteOffer } from "@/modules/hooks/offers/useDeleteOffer"
import { useOwnOffers } from "@/modules/hooks/offers/useOwnOffers"
import { GetOffersDTO } from "@/modules/domain/offers/DTO/GetOffersDTO"
import TabsComponent from "@/app/components/TabsComponent"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"
import { useUpdateOfferDeletedAt } from "@/modules/hooks/offers/useUpdateOfferDeletedAt"
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors"

const OwnOffersList = () => {
     const router = useRouter()
     const { data: ownOffers, isPending, error } = useOwnOffers()
     const { mutate: deleteOffer, isPending: isDeleting, error: deleteError } = useDeleteOffer()
     const { mutate: updateOfferDeletedAt, isPending: isUpdating, error: updateError } = useUpdateOfferDeletedAt()
     const theme = useTheme()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const [modalStates, setModalStates] = useState({
          isModalVisible: false,
          shouldDelete: false,
          offerId: "",
     })

     if (isPending) return <ActivityIndicator size="large" />
     if (error) {
          return <Text>{t("offers_fetch_error")}</Text>
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("offers_empty_message")}</Text>
               </View>
          )
     }

     const handleHardDeleteOffer = async (offerId: string) => {
          setModalStates({ isModalVisible: true, shouldDelete: false, offerId: offerId })
     }

     const handleSoftDeleteOffer = async (offerId: string) => {
          updateOfferDeletedAt({ offerId, deletedAt: new Date() })
     }

     const handleRestoreOffer = async (offerId: string) => {
          updateOfferDeletedAt({ offerId, deletedAt: null })
     }

     const handleUpdateOffer = async (offer: Offer) => {
          router.navigate({
               pathname: "/(app)/(tabs)/(home)/editOffer",
               params: {
                    offerId: offer.id,
               },
          })
     }

     const filterReservations = (state: string | null) => {
          return ownOffers.filter((item) => (state !== null ? item.deletedAt !== null : item.deletedAt === null))
     }

     const renderCardItem = ({ item }: ListRenderItemInfo<GetOffersDTO>) => {
          const username = item.profile.username as string
          const boatImages = item.boat.images as [
               {
                    id: string
                    url: string
                    caption: string
               },
          ]

          return (
               <Card key={item.id} style={[styles.card]}>
                    <Slideshow images={boatImages.map((img: any) => ({ id: img.id, url: img.url, caption: img.caption || "Image" }))} />

                    <Card.Title title={item.title} subtitle={item.description} />

                    <Card.Content>
                         <Text>
                              {t("published_by")} : {username}
                         </Text>
                         <Text>
                              {t("price")} : {item.price} {t("money_symbol")}
                         </Text>
                    </Card.Content>

                    <Card.Actions>
                         {item.deletedAt ? (
                              <>
                                   <Button style={{ marginHorizontal: 10 }} mode="contained" onPress={() => handleRestoreOffer(item.id)}>
                                        {t("restore")}
                                   </Button>
                                   <Button mode="outlined" onPress={() => handleHardDeleteOffer(item.id)}>
                                        {t("delete")}
                                   </Button>
                              </>
                         ) : (
                              <>
                                   <Button mode="contained" style={{ marginHorizontal: 10 }} onPress={() => handleUpdateOffer(item)}>
                                        {t("edit")}
                                   </Button>
                                   <Button mode="outlined" loading={isDeleting} disabled={isDeleting} onPress={() => handleSoftDeleteOffer(item.id as string)}>
                                        {t("inactive")}
                                   </Button>
                              </>
                         )}
                    </Card.Actions>
               </Card>
          )
     }

     const modalContent = (offerId: string) => {
          return (
               <View style={[styles.modalContent, { backgroundColor: theme.colors.inverseSurface }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.primaryContainer }]}>{t("modal_delete_offer_title")}</Text>
                    <Text style={{ color: theme.colors.primaryContainer, textAlign: "center" }}>{t("modal_delete_offer_description")}</Text>
                    <Button
                         style={[{ backgroundColor: theme.colors.primaryContainer, marginTop: 30, paddingVertical: 10 }]}
                         onPress={() => {
                              setModalStates({ isModalVisible: false, shouldDelete: false, offerId: "" })
                              deleteOffer(offerId)
                         }}
                    >
                         <Text style={{ color: theme.colors.inverseSurface, fontWeight: "bold" }}>{t("confirm_delete")}</Text>
                    </Button>
                    <Button
                         style={[
                              styles.button,
                              {
                                   borderWidth: 2,
                                   borderColor: theme.colors.primaryContainer,
                                   marginTop: 20,
                                   paddingVertical: 7,
                              },
                         ]}
                         onPress={() => setModalStates({ isModalVisible: false, shouldDelete: false, offerId: "" })}
                    >
                         <Text style={{ color: theme.colors.primaryContainer, fontWeight: "bold" }}>{t("cancel_delete")}</Text>
                    </Button>
               </View>
          )
     }

     const renderTabContent = (data: GetOffersDTO[] | [], emptyMessage: string) => <FlatList data={data} keyExtractor={(item) => item.id as string} renderItem={renderCardItem} ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.colors.primary }]}>{emptyMessage}</Text>} />

     return (
          <>
               <Portal>
                    <Modal visible={modalStates.isModalVisible} children={modalContent(modalStates.offerId)} style={styles.modalContainer} />
               </Portal>
               <TabsComponent tabLabels={[t("owner_offers_all_btn"), t("owner_offers_active_btn"), t("owner_offers_inactive_btn")]}>
                    {renderTabContent(ownOffers, t("owner_offers_empty_message"))}
                    {renderTabContent(filterReservations(null), t("owner_offers_active_empty_message"))}
                    {renderTabContent(filterReservations("deleted"), t("owner_offers_inactive_empty_message"))}
               </TabsComponent>
          </>
     )
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
     emptyMessage: {
          textAlign: "center",
          marginVertical: 20,
          fontSize: 16,
     },
     modalContainer: {
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
     },
     modalContent: {
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 40,
          borderRadius: 10,
          width: "90%",
          marginLeft: "5%",
     },
     modalTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
     },
     button: {
          borderWidth: 1,
          marginTop: 10,
     },
})

export default OwnOffersList
