import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Modal, Text, TextInput, useTheme } from "react-native-paper"
import { PaperSelect } from "react-native-paper-select"
import Slideshow from "@/modules/components/Slideshow"
import React, { useState } from "react"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useBoatTypeOptions } from "@/constants/BoatTypes"

import { Offer } from "@/interfaces/Offer"
import { Link, router } from "expo-router"

export default function index() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const [isLoading, setIsLoading] = useState(false)
     const colors = useTheme().colors
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

     const [modalVisible, setModalVisible] = React.useState(false)

     const createOffer = () => {}

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

                              <Button mode="contained" style={styles.selectBoatBtn} onPress={() => router.navigate("/selectBoat")}>
                                   {t("select_boat_button")}
                              </Button>
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
     screenContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
     },
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
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
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
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
     selector: {
          width: "100%",
          marginVertical: 10,
     },
     boatImage: {
          width: "100%",
          height: 250,
     },
     slideShow: {
          width: "100%",
          height: 250,
          marginVertical: 30,
     },
     selectBoatBtn: {
          marginVertical: 10,
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
})
