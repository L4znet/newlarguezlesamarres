import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter, useLocalSearchParams } from "expo-router"
import { RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"
import { useOfferById } from "@/modules/hooks/offers/useOfferById"

export default function EditOffer() {
     const router = useRouter()
     const { setLocation, setEquipments, setRentalPeriod, selectBoat, currentOffer } = useOfferExternalScreenStore()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (!currentOffer) {
          showTranslatedFlashMessage("danger", {
               title: "flash_title_danger",
               description: "No offer selected",
          })
          router.navigate("/(app)/(tabs)/(home)")
     }

     const { data: fetchedOffer, isPending: isOfferPending, error: offerError } = useOfferById(currentOffer?.id as string)

     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)

     // Local State
     const [offer, setOffer] = useState({
          boatId: "",
          profileId: "",
          title: "",
          description: "",
          price: 0,
          isAvailable: false,
          isSkipperAvailable: false,
          isTeamAvailable: false,
     })

     const [frequency, setFrequency] = useState({
          value: rentalFrequencyOptions[0].value,
          list: rentalFrequencyOptions,
          selectedList: [rentalFrequencyOptions[0]],
          error: "",
          id: parseInt(RentalFrequency.Hour),
     })

     useEffect(() => {
          console.log("RENDER")

          if (fetchedOffer) {
               console.log("RENDER")
               setOffer({
                    boatId: fetchedOffer.boatId,
                    profileId: fetchedOffer.profileId,
                    title: fetchedOffer.title,
                    description: fetchedOffer.description,
                    price: fetchedOffer.price,
                    isAvailable: fetchedOffer.isAvailable,
                    isSkipperAvailable: fetchedOffer.isSkipperAvailable,
                    isTeamAvailable: fetchedOffer.isTeamAvailable,
               })

               selectBoat(fetchedOffer.boatId)

               setLocation({
                    city: fetchedOffer.location.city,
                    address: fetchedOffer.location.address,
                    country: fetchedOffer.location.country,
                    zipcode: fetchedOffer.location.zipcode,
               })
               setEquipments(fetchedOffer.equipments)
               setRentalPeriod(fetchedOffer.rentalPeriod.start, fetchedOffer.rentalPeriod.end)

               setFrequency({
                    value: rentalFrequencyOptions[fetchedOffer.frequency]?.value || rentalFrequencyOptions[0].value,
                    list: rentalFrequencyOptions,
                    selectedList: [rentalFrequencyOptions[fetchedOffer.frequency] || rentalFrequencyOptions[0]],
                    error: "",
                    id: fetchedOffer.frequency,
               })
          }
     }, [fetchedOffer])

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     if (isOfferPending) return <Text>{t("loading_offer")}</Text>
     if (offerError) return <Text>{t("error_loading_offer")}</Text>

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={offer.title} onChangeText={(title) => setOffer({ ...offer, title })} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={offer.description} onChangeText={(description) => setOffer({ ...offer, description })} />
                         <TextInput style={styles.input} placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={offer.price.toString()} onChangeText={(price) => setOffer({ ...offer, price: parseFloat(price) })} />
                         <PaperSelect
                              label={t("rental_frequency_placeholder")}
                              value={frequency.value}
                              onSelection={(value: any) => {
                                   setFrequency({
                                        ...frequency,
                                        value: value.text,
                                        selectedList: value.selectedList,
                                        error: "",
                                        id: parseInt(value.selectedList[0]._id),
                                   })
                              }}
                              arrayList={[...frequency.list]}
                              selectedArrayList={frequency.selectedList}
                              errorText={frequency.error}
                              multiEnable={false}
                         />
                         <View style={styles.inputRow}>
                              <Text>{t("is_available_label")}</Text>
                              <Switch value={offer.isAvailable} onValueChange={(value) => setOffer({ ...offer, isAvailable: value })} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_skipper_available_label")}</Text>
                              <Switch value={offer.isSkipperAvailable} onValueChange={(value) => setOffer({ ...offer, isSkipperAvailable: value })} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_team_available_label")}</Text>
                              <Switch value={offer.isTeamAvailable} onValueChange={(value) => setOffer({ ...offer, isTeamAvailable: value })} />
                         </View>
                         <Button
                              icon={fetchedOffer?.equipments?.length ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectEquipments", {
                                        backPath: "/editOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_equipment_button")}
                         </Button>

                         <Button
                              icon={fetchedOffer?.rentalPeriod?.start && fetchedOffer?.rentalPeriod?.end ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectRentalPeriod", {
                                        backPath: "/editOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_rental_period_button")}
                         </Button>
                         <Button
                              icon={fetchedOffer?.location.city && fetchedOffer?.location.address && fetchedOffer?.location.country && fetchedOffer?.location.zipcode ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectLocation", {
                                        backPath: "/editOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_location_button")}
                         </Button>
                         <Button
                              icon={fetchedOffer?.boatId ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectBoat", {
                                        backPath: "/editOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_boat_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          width: "90%",
          alignSelf: "center",
     },
     safeView: {
          flex: 1,
          paddingHorizontal: 20,
     },
     scrollView: {
          flexGrow: 1,
          marginTop: 30,
     },
     input: {
          marginVertical: 10,
     },
     textarea: {
          marginVertical: 10,
     },
     inputRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
     },
     button: {
          marginVertical: 10,
     },
})
