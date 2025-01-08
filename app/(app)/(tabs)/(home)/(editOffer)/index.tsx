import React, { useEffect, useCallback } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { useOfferStore } from "@/modules/stores/offerStore"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { Controller, FieldError, FieldErrorsImpl, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Merge } from "type-fest"
import { useCountBoats } from "@/modules/hooks/boats/useCountBoats"
import { useFocusEffect } from "@react-navigation/native"
import { useUpdateOffer } from "@/modules/hooks/offers/useUpdateOffer"
import { useSpecificData } from "@/modules/hooks/offers/useSpecificData"

export default function editOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const { resetStore, getErrors, equipments, setRentalPeriod, setTemporaryStartDate, setTemporaryLocation, setTemporaryEndDate, setLocation, rentalPeriod, location, selectedBoatId, title, description, price, isAvailable, isSkipperAvailable, isTeamAvailable } = useOfferStore()
     const { data: boatsCount, isPending: boatsCountIsPending, error: boatsCountError } = useCountBoats()

     const { mutate: updateOffer, isPending } = useUpdateOffer()

     const { offerId } = useLocalSearchParams<{ offerId: string }>()

     const { mutate: getLocation } = useSpecificData()

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
          setValue,
          resetField,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(OfferSchema),
          defaultValues: {
               title: title,
               description: description,
               price: price,
               isAvailable: isAvailable,
               isSkipperAvailable: isSkipperAvailable,
               isTeamAvailable: isTeamAvailable,
               equipments: equipments,
               rentalPeriod: rentalPeriod,
               location: location,
               selectedBoatId: selectedBoatId,
          },
     })

     const onSubmit = async (data: any) => {
          try {
               updateOffer({
                    ...data,
                    id: offerId,
               })

               setValue("title", title)
               setValue("description", description)
               setValue("price", price)
               setValue("isAvailable", isAvailable)
               setValue("isSkipperAvailable", isSkipperAvailable)
               setValue("isTeamAvailable", isTeamAvailable)
               setValue("equipments", equipments)
               setValue("rentalPeriod", rentalPeriod)
               setValue("location", location)
               setValue("selectedBoatId", selectedBoatId)
               setRentalPeriod(rentalPeriod.start, rentalPeriod.end)
               setTemporaryStartDate(new Date(rentalPeriod.start))
               setTemporaryEndDate(new Date(rentalPeriod.end))
               setTemporaryLocation(location)
               setLocation(location)
          } catch (error) {
               showTranslatedFlashMessage("danger", {
                    title: t("flash_title_error"),
                    description: t("supabase_offer_error_added_offer"),
               })
          }
     }

     const onError = () => {
          showTranslatedFlashMessage("danger", {
               title: t("flash_title_danger"),
               description: t("fix_errors_before_submitting"),
          })
     }

     const displayErrorIcon = (displayError: boolean) => {
          if (displayError) {
               return "close"
          } else {
               return "check"
          }
     }

     const onBlurTrigger = async (field: any) => {
          await trigger(field)
     }

     const selectLocation = () => {
          getLocation({ offerId, dataToSearch: "location" })
          handleNavigate("/selectLocation", {
               initialLocation: location,
               backPath: "/(editOffer)",
               offerId: offerId,
          })
     }

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
                              onPress={() => {
                                   handleNavigate("/selectEquipments", {
                                        initialEquipments: equipments || [],
                                        backPath: "/(editOffer)",
                                        offerId: offerId,
                                   })
                              }}
                              style={styles.button}
                         >
                              {t("select_equipment_button")}
                         </Button>
                         <Button
                              icon={rentalPeriod.start && rentalPeriod.end ? displayErrorIcon(!!errors.rentalPeriod) : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectRentalPeriod", {
                                        initialPeriod: rentalPeriod,
                                        backPath: "/(editOffer)",
                                        offerId: offerId,
                                   })
                              }
                              style={[styles.button, errors.rentalPeriod ? styles.buttonError : ""]}
                         >
                              {t("select_rental_period_button")}
                         </Button>

                         {errors.rentalPeriod && <Text style={styles.errorText}>{t(errors.rentalPeriod.message as string)}</Text>}

                         <Button icon={location.city && location.address && location.country && location.zipcode ? displayErrorIcon(!!errors.location) : "plus"} mode="contained" onPress={() => selectLocation()} style={[styles.button, errors.location ? styles.buttonError : ""]}>
                              {t("select_location_button")}
                         </Button>

                         {errors.location && <Text style={styles.errorText}>{t(errors.location.message as string)}</Text>}

                         <Button
                              icon={selectedBoatId ? displayErrorIcon(!!errors.selectedBoatId) : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectBoat", {
                                        initialBoatId: selectedBoatId,
                                        backPath: "/(editOffer)",
                                        offerId: offerId,
                                   })
                              }
                              style={[styles.button, errors.selectedBoatId ? styles.buttonError : ""]}
                         >
                              {t("select_boat_button")}
                         </Button>
                         {errors.selectedBoatId && <Text style={styles.errorText}>{t(errors.selectedBoatId.message as string)}</Text>}

                         <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit, onError)} loading={isPending} disabled={isPending}>
                              {isPending ? t("loading_button_text") : t("edit_offer_button")}
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
