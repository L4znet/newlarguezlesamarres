import React, { useEffect, useCallback, useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch, Portal, Modal } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { useOfferStore } from "@/modules/stores/offerStore"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { Controller, FieldError, FieldErrorsImpl, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Merge } from "type-fest"
import { useCountBoats } from "@/modules/hooks/boats/useCountBoats"
import { useFocusEffect } from "@react-navigation/native"
import { DatePickerModal } from "react-native-paper-dates"
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import SelectLocation from "@/app/(app)/(tabs)/(home)/(createOffer)/selectLocation"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"

export default function createOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const [open, setOpen] = useState(false)
     const [range, setRange] = useState<{ startDate: CalendarDate; endDate: CalendarDate }>({ startDate: undefined, endDate: undefined })
     const [visible, setVisible] = useState(false)
     const [searchTerm, setSearchTerm] = useState("")
     const [locationData, setLocationData] = useState([])

     const { resetStore, getErrors, equipments, setRentalPeriod, setTemporaryStartDate, setTemporaryLocation, setTemporaryEndDate, setLocation, rentalPeriod, location, selectedBoatId } = useOfferStore()
     const { data: boatsCount, isPending: boatsCountIsPending, error: boatsCountError } = useCountBoats()

     const { mutate: createOffer, isPending } = useCreateOffer()
     const { mutate: createOffer, isPending } = useLocationSearch()

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     useFocusEffect(
          useCallback(() => {
               if (boatsCount === 0) {
                    showTranslatedFlashMessage("warning", {
                         title: "flash_title_warning",
                         description: "flash_description_no_boats",
                    })
                    router.navigate("/(app)/(tabs)/(home)")
               }
          }, [boatsCount])
     )

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutate(searchTerm)
               setValidationError(null)
          }
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
               title: "",
               description: "",
               price: "",
               isAvailable: false,
               isSkipperAvailable: false,
               isTeamAvailable: false,
               equipments: [
                    {
                         equipmentName: "",
                         equipmentQuantity: "",
                    },
               ],
               rentalPeriod: {
                    startDate: range.startDate,
                    endDate: range.endDate,
               },
               location: {
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               },
               selectedBoatId: "",
          },
     })
     if (location.zipcode && location.city && location.address && location.country) {
          setValue("location", location)
          resetField("location")
     } else {
          setValue("location", {
               city: "",
               country: "",
               address: "",
               zipcode: "",
          })
          resetField("location")
     }

     if (selectedBoatId) {
          resetField("selectedBoatId")
          setValue("selectedBoatId", selectedBoatId)
     } else {
          setValue("selectedBoatId", "")
          resetField("selectedBoatId")
     }

     if (equipments.length > 0) {
          setValue("equipments", equipments)
     }

     const onSubmit = async (data: any) => {
          try {
               createOffer({
                    ...data,
               })

               setValue("title", "")
               setValue("description", "")
               setValue("price", "")
               setValue("isAvailable", false)
               setValue("isSkipperAvailable", false)
               setValue("isTeamAvailable", false)
               setValue("equipments", [])
               setValue("location", {
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               })
               setValue("selectedBoatId", "")
               setRentalPeriod("", "")
               setTemporaryStartDate(null)
               setTemporaryEndDate(null)
               setTemporaryLocation({
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               })
               setLocation({
                    city: "",
                    country: "",
                    address: "",
                    zipcode: "",
               })
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

     const onDismiss = useCallback(() => {
          setOpen(false)
     }, [setOpen])

     const onConfirm = useCallback(
          ({ startDate, endDate }: { startDate: CalendarDate; endDate: CalendarDate }) => {
               setOpen(false)
               setRange({ startDate, endDate })
          },
          [setOpen, setRange]
     )

     const showTestModal = () => setVisible(true)
     const hideTestModal = () => setVisible(false)

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

                         <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                              {t("select_rental_period_button")}
                         </Button>

                         <Controller
                              name={"rentalPeriod"}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                   <View>
                                        <DatePickerModal locale={locale} onChange={onChange} mode="range" visible={open} onDismiss={onDismiss} startDate={value.startDate} endDate={value.endDate} onConfirm={onConfirm} />
                                   </View>
                              )}
                         />

                         <Portal>
                              <Modal visible={visible} onDismiss={hideTestModal} contentContainerStyle={styles.modalContainerStyle}>
                                   <SelectLocation searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} isPending={isPending} locationData={locationData} handleSelectLocation={handleSelectLocation} temporaryLocation={temporaryLocation} showTranslatedFlashMessage={showTranslatedFlashMessage} router={router} t={t} errors={errors} theme={theme} temporaryLocation={temporaryLocation} setLocation={setLocation} />
                              </Modal>
                         </Portal>

                         <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">
                              Outlined Modal
                         </Button>

                         {errors.selectedBoatId && <Text style={styles.errorText}>{t(errors.selectedBoatId.message as string)}</Text>}

                         <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit, onError)} loading={isPending} disabled={isPending}>
                              {isPending ? t("loading_button_text") : t("create_offer_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     modalContainerStyle: {
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          flex: 1,
     },
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
