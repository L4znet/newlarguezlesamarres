import React, { useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { displayRentalFrequency, RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"
import { useOfferStore } from "@/modules/stores/offerStore"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function createOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)

     const { getErrors, equipments, rentalPeriod, location, selectedBoatId, title, description, price, isAvailable, isSkipperAvailable, isTeamAvailable, setFrequency, frequency } = useOfferStore()

     const { mutate: createOffer, isPending } = useCreateOffer()

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     const {
          control,
          handleSubmit,
          trigger,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(OfferSchema),
          defaultValues: {
               title: title || "",
               description: description || "",
               price: price || "",
               isAvailable: isAvailable || false,
               isSkipperAvailable: isSkipperAvailable || false,
               isTeamAvailable: isTeamAvailable || false,
               equipments: equipments || [],
               rentalPeriod: rentalPeriod,
               location: location || { city: "", address: "", country: "", zipcode: "" },
               selectedBoatId: selectedBoatId || "",
               frequency: frequency.value || "",
          },
     })

     console.log("Erreurs zod", errors)
     console.log("rentalPeriod", rentalPeriod)

     const onSubmit = async (data: any) => {
          try {
               createOffer({
                    ...data,
                    rentalPeriod,
                    location,
                    selectedBoatId,
                    isAvailable,
                    isSkipperAvailable,
                    isTeamAvailable,
                    frequency: rentalFrequencyOptions[0]._id,
                    equipments,
                    deletedAt: null,
               })

               showTranslatedFlashMessage("success", {
                    title: t("flash_title_success"),
                    description: t("offer_created_success"),
               })
          } catch (error) {
               showTranslatedFlashMessage("danger", {
                    title: t("flash_title_error"),
                    description: t("offer_creation_error"),
               })
          }
     }

     const onError = () => {
          showTranslatedFlashMessage("danger", {
               title: t("flash_title_danger"),
               description: t("fix_errors_before_submitting"),
          })
     }

     const displayIcon = (errorLabel: string, isErrors: string[] | null) => {
          if (isErrors) {
               return "close"
          } else {
               return "check"
          }
     }

     const onBlurTrigger = async (field: any) => {
          await trigger(field)
     }

     console.log('getErrors("rentalPeriod")', getErrors("rentalPeriod"))

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                         <Controller
                              name="title"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View>
                                        <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={value} onChangeText={onChange} error={!!errors.title} />
                                        {errors.title && <Text style={styles.errorText}>{t(errors.title.message as string)}</Text>}
                                   </View>
                              )}
                         />

                         <Controller
                              name="description"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View>
                                        <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={value} onChangeText={onChange} error={!!errors.description} />
                                        {errors.description && <Text style={styles.errorText}>{t(errors.description.message as string)}</Text>}
                                   </View>
                              )}
                         />
                         <Controller
                              name="price"
                              control={control}
                              render={({ field: { onChange, value } }) => {
                                   return (
                                        <View>
                                             <TextInput style={styles.input} keyboardType="decimal-pad" placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={value} onChangeText={onChange} onBlur={() => onBlurTrigger("price")} error={!!errors.price} />
                                             {errors.price && <Text style={styles.errorText}>{t(errors.price.message as string)}</Text>}
                                        </View>
                                   )
                              }}
                         />

                         <Controller
                              name="isAvailable"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View style={styles.inputRow}>
                                        <Text>{t("is_available_label")}</Text>
                                        <Switch value={value} onValueChange={onChange} />
                                        {errors.isAvailable && <Text style={styles.errorText}>{t(errors.isAvailable.message as string)}</Text>}
                                   </View>
                              )}
                         />

                         <Controller
                              name="isSkipperAvailable"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View style={styles.inputRow}>
                                        <Text>{t("is_skipper_available_label")}</Text>
                                        <Switch value={value} onValueChange={onChange} />
                                        {errors.isSkipperAvailable && <Text style={styles.errorText}>{t(errors.isSkipperAvailable.message as string)}</Text>}
                                   </View>
                              )}
                         />
                         <Controller
                              name="isTeamAvailable"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View style={styles.inputRow}>
                                        <Text>{t("is_team_available_label")}</Text>
                                        <Switch value={value} onValueChange={onChange} />
                                        {errors.isTeamAvailable && <Text style={styles.errorText}>{t(errors.isTeamAvailable.message as string)}</Text>}
                                   </View>
                              )}
                         />

                         <Button
                              icon={equipments.length > 0 ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectEquipments", {
                                        initialEquipments: equipments || [],
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_equipment_button")}
                         </Button>
                         <Button
                              icon={rentalPeriod.start && rentalPeriod.end ? displayIcon("rentalPeriod", getErrors("rentalPeriod")) : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectRentalPeriod", {
                                        initialPeriod: rentalPeriod,
                                        backPath: "/createOffer",
                                        control: control,
                                        fieldIds: {
                                             rentalPeriod: "rentalPeriod",
                                             frequency: "frequency",
                                        },
                                   })
                              }
                              style={[styles.button, getErrors("rentalPeriod") ? styles.buttonError : ""]}
                         >
                              {t("select_rental_period_button")}
                         </Button>

                         {getErrors("rentalPeriod") &&
                              getErrors("rentalPeriod")?.map((error, index) => (
                                   <Text key={index} style={styles.errorText}>
                                        {error}
                                   </Text>
                              ))}

                         <Button
                              icon={location.city && location.address && location.country && location.zipcode ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectLocation", {
                                        initialLocation: location,
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_location_button")}
                         </Button>

                         <Button
                              icon={selectedBoatId ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectBoat", {
                                        initialBoatId: selectedBoatId,
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_boat_button")}
                         </Button>

                         <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit, onError)} loading={isPending} disabled={isPending}>
                              {isPending ? t("loading_button_text") : t("create_offer_button")}
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
          color: "white",
     },
     button: {
          marginVertical: 10,
     },
     submitButton: {
          marginTop: 50,
     },
     equipmentList: {
          paddingBottom: 16,
          marginVertical: 30,
     },
     errorText: {
          color: "#ea5555",
          fontSize: 16,
     },
     buttonError: {
          backgroundColor: "#e59b9b",
     },
})
