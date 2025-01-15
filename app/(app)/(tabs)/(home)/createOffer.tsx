import React, { useCallback, useState } from "react"
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Text, TextInput, Switch, ActivityIndicator, Card, useTheme } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCountBoats } from "@/modules/hooks/boats/useCountBoats"
import { useFocusEffect } from "@react-navigation/native"
import { DatePickerModal } from "react-native-paper-dates"
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"
import { displaySpecificRentalDate } from "@/constants/DisplayRentalPeriod"
import SelectEquipments from "@/modules/components/SelectEquipments"
import SelectBoat from "@/modules/components/SelectBoat"

export default function createOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const [open, setOpen] = useState(false)
     const [range, setRange] = useState<{ startDate: CalendarDate; endDate: CalendarDate }>({ startDate: undefined, endDate: undefined })
     const [visible, setVisible] = useState(false)
     const [searchTerm, setSearchTerm] = useState("")
     const theme = useTheme()

     const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null)
     const [rentalPeriod, setRentalPeriod] = useState<{ startDate: CalendarDate; endDate: CalendarDate }>({ startDate: undefined, endDate: undefined })
     const [location, setLocation] = useState({
          city: "",
          country: "",
          address: "",
          zipcode: "",
     })

     const { data: boatsCount } = useCountBoats()

     const { mutate: createOffer, isPending: isPendingCreateOffer } = useCreateOffer()
     const { mutate: mutateSearchLocation, data: locationData, isPending: isPendingLocationSearch, error: errorFromFetch, reset: resetSearchResults } = useLocationSearch()

     console.log("RENDER")

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

     const {
          control,
          handleSubmit,
          trigger,
          setValue,
          getValues,
          reset,
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
               equipments: [],
               rentalPeriod: {
                    start: range.startDate?.toDateString(),
                    end: range.endDate?.toDateString(),
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

     const onSubmit = async (data: any) => {
          try {
               createOffer({
                    ...data,
               })
               reset()
               setRentalPeriod({ startDate: undefined, endDate: undefined })
               setSelectedBoatId(null)
               setLocation({
                    city: "",
                    country: "",
                    zipcode: "",
                    address: "",
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

     if (isPendingCreateOffer) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
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
               setRentalPeriod({ startDate, endDate })
               setValue("rentalPeriod", {
                    start: startDate?.toISOString().split("T")[0],
                    end: endDate?.toISOString().split("T")[0],
               })
          },
          [setOpen, setRange]
     )

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutateSearchLocation(searchTerm)
          }
     }

     const handleSelectLocation = (location: any) => {
          const { streetNumber, streetName, municipality, country, postalCode } = location.address

          mutateSearchLocation("", {
               onSuccess: () => {
                    resetSearchResults()
               },
          })

          setSearchTerm("")
          setLocation({
               city: municipality,
               country: country,
               zipcode: postalCode,
               address: streetNumber + " " + streetName,
          })
          setValue("location", {
               city: municipality,
               country: country,
               zipcode: postalCode,
               address: streetNumber + " " + streetName,
          })
     }

     const handleSelectBoat = (boat: any) => {
          setSelectedBoatId(boat.id)
     }

     const EmptyBoatList = () => {
          return (
               <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>{t("select_boat_empty_message")}</Text>
               </View>
          )
     }

     console.log("Erreurs", errors)

     console.log(getValues("rentalPeriod"))

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

                         <View style={styles.step}>
                              <Text style={styles.selectionTitle}>{t("select_location_title")}</Text>
                              <Controller
                                   name="location"
                                   control={control}
                                   render={({ field: { onChange } }) => (
                                        <TextInput
                                             label={t("location_search_label")}
                                             placeholder={t("location_search_placeholder")}
                                             value={searchTerm}
                                             style={styles.input}
                                             onChangeText={(text) => {
                                                  onChange(text)
                                                  setSearchTerm(text)
                                             }}
                                             onEndEditing={handleSearch}
                                        />
                                   )}
                              />
                              {errors.location && <Text style={styles.errorText}>{t(errors.location.message as string)}</Text>}

                              {isPendingLocationSearch && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}

                              {errorFromFetch && <Text style={styles.errorText}>Une erreur est survenue lors de la recherche.</Text>}
                              {locationData && locationData.length > 0 && (
                                   <FlatList
                                        data={locationData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                             <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectLocation(item)}>
                                                  <Text style={styles.resultText}>{item.address.freeformAddress}</Text>
                                             </TouchableOpacity>
                                        )}
                                   />
                              )}

                              {!isPendingLocationSearch && locationData && locationData.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                              {locationData && locationData.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                              {location.address && location.country && location.zipcode && location.city && (
                                   <View>
                                        <Card style={styles.selectionCard}>
                                             <Card.Content>
                                                  <Text>{location.address + ", " + location.zipcode + " " + location.city + ", " + location.country}</Text>
                                             </Card.Content>
                                        </Card>
                                   </View>
                              )}
                         </View>

                         <View style={styles.step}>
                              <Text style={styles.selectionTitle}>{t("select_rental_title")}</Text>
                              <Button onPress={() => setOpen(true)} uppercase={false} mode="contained">
                                   {t("select_rental_period_button")}
                              </Button>

                              <Controller
                                   name={"rentalPeriod"}
                                   control={control}
                                   render={({ field: { onChange, value } }) => (
                                        <View>
                                             <DatePickerModal
                                                  locale={locale}
                                                  onChange={() => {
                                                       onChange({ start: range.startDate?.toDateString(), end: range.endDate?.toDateString() })
                                                       setRentalPeriod({ startDate: range.startDate, endDate: range.endDate })
                                                  }}
                                                  mode="range"
                                                  visible={open}
                                                  onDismiss={onDismiss}
                                                  startDate={range.startDate}
                                                  endDate={range.endDate}
                                                  onConfirm={onConfirm}
                                             />

                                             {rentalPeriod.startDate && rentalPeriod.endDate && (
                                                  <View style={styles.selectedDates}>
                                                       <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                                                            {t("start_date_label")}: {rentalPeriod.startDate ? displaySpecificRentalDate(rentalPeriod.startDate, locale) : ""}
                                                       </Text>
                                                       <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                                                            {t("end_date_label")}: {rentalPeriod.endDate ? displaySpecificRentalDate(rentalPeriod.endDate, locale) : ""}
                                                       </Text>
                                                  </View>
                                             )}
                                        </View>
                                   )}
                              />
                         </View>

                         <View style={styles.step}>
                              <Text style={styles.selectionTitle}>{t("select_equipment_title")}</Text>

                              <Controller name="equipments" control={control} render={({ field: { onChange, value } }) => <SelectEquipments equipments={value} setEquipments={onChange} />} />
                         </View>

                         <View style={styles.step}>
                              <Controller
                                   name="selectedBoatId"
                                   control={control}
                                   render={({ field: { onChange, value } }) => {
                                        return <SelectBoat selectedBoatId={value} handleSelectBoat={onChange} />
                                   }}
                              />
                         </View>

                         <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit, onError)} loading={isPendingCreateOffer} disabled={isPendingCreateOffer}>
                              {isPendingCreateOffer ? t("loading_button_text") : t("create_offer_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     modalContainerStyle: {
          margin: 20,
          backgroundColor: "white",
          flex: 1,
     },
     step: {
          marginTop: 40,
          marginBottom: 20,
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

     content: {
          padding: 20,
     },
     resultItem: {
          padding: 10,
          borderBottomWidth: 1,
     },
     resultText: {
          fontSize: 16,
     },
     selectedDates: {
          marginVertical: 20,
     },
     dateText: {
          fontSize: 16,
          textAlign: "center",
     },
     noResultsText: {
          textAlign: "center",
          marginTop: 20,
          fontSize: 16,
     },
     loading: {
          marginVertical: 20,
     },
     actionButton: {
          marginTop: 20,
     },
     selectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
     },
     selectionCard: {
          padding: 10,
          borderRadius: 8,
     },

     title: {
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
     },
     boatItem: {
          padding: 5,
          paddingVertical: 30,
          marginVertical: 10,
          fontSize: 16,
          borderRadius: 10,
     },
     boatName: {
          fontSize: 16,
          fontWeight: "bold",
     },
})
