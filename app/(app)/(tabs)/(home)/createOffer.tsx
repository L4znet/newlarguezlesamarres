import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Portal, Text, TextInput, useTheme, Modal, Card, ActivityIndicator, Icon } from "react-native-paper"
import Slideshow from "@/modules/components/Slideshow"
import React, { useCallback, useRef, useState } from "react"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

import { Offer } from "@/interfaces/Offer"
import { useBoats } from "@/modules/hooks/boats/useBoats"

export default function createOffer() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const [isLoading, setIsLoading] = useState(false)
     const [offer, setOffer] = useState<Offer>({
          boatId: "",
          profileId: "",
          title: "",
          description: "",
          price: 0,
          isAvailable: true,
          frequency: 0,
          equipments: [],
          isSkipperAvailable: false,
          isTeamAvailable: false,
          rentalPeriods: [],
          location: {
               city: "",
               country: "",
               zipCode: "",
               address: "",
          },
          createdAt: "",
          updatedAt: "",
          deletedAt: undefined,
     })

     const [visible, setVisible] = React.useState(false)

     const theme = useTheme()

     const showModal = () => setVisible(true)
     const hideModal = () => setVisible(false)

     const createOffer = () => {}

     const handleSelect = (boatId: string) => {
          setCurrentSelection(boatId)
          hideModal()
          console.log("boatId", boatId)
     }

     const { data: boats, isPending, error } = useBoats()
     const [currentSelection, setCurrentSelection] = useState<string | null>(null)

     const colors = useTheme().colors

     const renderItem = ({ item }: any) => (
          <TouchableOpacity onPress={() => handleSelect(item.boatId)} style={[styles.cardContainer, currentSelection === item.boatId && styles.selectedCard]}>
               <Text style={[styles.cardText, currentSelection === item.boatId && styles.selectedBoatText]}>{item.boatName}</Text>
               {currentSelection === item.boatId && <Icon source="check" size={24} color="#4aace1" />}
          </TouchableOpacity>
     )

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={offer.title} onChangeText={(title) => setOffer({ ...offer, title })} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={offer.description} onChangeText={(description) => setOffer({ ...offer, description })} />
                         <TextInput style={styles.input} placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={offer.price.toString()} onChangeText={(price) => setOffer({ ...offer, price: parseFloat(price) })} />
                         <TextInput style={styles.input} placeholder={t("offer_frequency_placeholder")} label={t("offer_frequency_label")} value={offer.frequency.toString()} onChangeText={(frequency) => setOffer({ ...offer, frequency: parseFloat(frequency) })} />
                         <TextInput style={styles.input} placeholder={t("offer_city_placeholder")} label={t("offer_city_label")} value={offer.location.city} onChangeText={(city) => setOffer({ ...offer, location: { ...offer.location, city } })} />

                         <Slideshow images={[]} />

                         <View style={styles.boatSelect}>
                              <Text variant={"titleMedium"} style={styles.step_title}>
                                   {t("select_boat_title")}
                              </Text>

                              <Button mode="contained" onPress={() => showModal()} style={styles.selectBoatBtn}>
                                   {t("select_boat_button")}
                              </Button>

                              <Portal theme={theme}>
                                   <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                                        {isLoading && <ActivityIndicator size="large" />}
                                        {error && <Text>Erreur lors de la récupération des bateaux</Text>}
                                        {boats && <FlatList style={styles.modal} data={boats} keyExtractor={(item) => item.boatId} renderItem={renderItem} />}
                                   </Modal>
                              </Portal>
                         </View>

                         <Button mode="contained" style={styles.button} onPress={() => createOffer()} loading={isLoading} disabled={isLoading}>
                              {isLoading ? t("loading_button_text") : t("create_offer_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     modal: {
          flex: 1,
          marginTop: 10,
     },
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     scrollViewBoats: {
          width: "100%",
          rowGap: 20,
          paddingTop: 20,
     },
     safeView: {
          width: "90%",
          rowGap: 20,
          justifyContent: "flex-end",
          alignItems: "flex-end",
     },
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
     },
     input: {
          width: "100%",
          marginVertical: 10,
     },
     textarea: {
          width: "100%",
          marginVertical: 10,
     },
     selectBoatBtn: {
          marginVertical: 10,
          marginBottom: 30,
          marginHorizontal: 20,
     },
     step_title: {
          fontWeight: "bold",
          textAlign: "center",
          padding: 10,
          width: "100%",
          height: 70,
     },
     button: {
          marginVertical: 20,
     },
     boatSelect: {
          width: "100%",
          marginVertical: 20,
     },

     modalContainer: {
          borderRadius: 20,
          height: "60%",
          width: "100%",
          borderWidth: 7,
          borderStyle: "solid",
          backgroundColor: "white",
          bottom: 0,
          position: "absolute",
     },

     selectedBoatText: {
          color: "#4aace1",
     },
     cardContainer: {
          marginVertical: 5,
          marginHorizontal: 10,
          backgroundColor: "#262626",
          padding: 20,
          borderRadius: 10,
          borderColor: "#262626",
          borderWidth: 6,
          height: 100,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
     },
     selectedCard: {
          borderRadius: 10,
          borderColor: "#4aace1",
          borderWidth: 6,
     },
     checkIcon: {
          position: "absolute",
          right: 10,
          top: 10,
     },
     cardText: {
          color: "#fff",
          fontSize: 16,
     },
})