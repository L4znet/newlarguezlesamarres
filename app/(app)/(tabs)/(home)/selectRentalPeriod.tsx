import React, { useEffect, useRef, useState } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { Button, Text } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import CalendarPicker from "react-native-calendar-picker"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useTheme } from "react-native-paper"
import { useOfferStore } from "@/modules/stores/offerStore"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { PaperSelect } from "react-native-paper-select"
import { displayRentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"

export default function SelectRentalPeriod() {
     const { rentalPeriod, setRentalPeriod, setErrors, clearErrors, getErrors, setFrequency, frequency } = useOfferStore()
     const [calendarKey, setCalendarKey] = useState(0)
     const rawStartDate = rentalPeriod.start ? new Date(rentalPeriod.start) : null
     const rawEndDate = rentalPeriod.end ? new Date(rentalPeriod.end) : null

     const [startDate, setStartDate] = useState<Date | null>(rawStartDate)
     const [endDate, setEndDate] = useState<Date | null>(rawEndDate)

     const router = useRouter()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const theme = useTheme()
     const { backPath } = useLocalSearchParams<{ backPath: string }>()
     const calendarRef = React.createRef<CalendarPicker>()
     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)
     const isInitialized = useRef(false)

     if (!isInitialized.current) {
          setFrequency({
               value: rentalFrequencyOptions[0]?.value || "",
               list: rentalFrequencyOptions || [],
               selectedList: [rentalFrequencyOptions[0]] || [],
               error: "",
               id: rentalFrequencyOptions[0]?._id || 0,
          })
          isInitialized.current = true
     }

     const handleDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
          if (type === "END_DATE") {
               setEndDate(date)
               clearErrors("rentalPeriod")
          } else {
               setStartDate(date)
               setEndDate(null)
               clearErrors("rentalPeriod")
          }
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }

     const handleConfirm = () => {
          if (!startDate) {
               const errorMessage = t("start_date_required")
               setErrors("rentalPeriod", [errorMessage])
               return
          }

          if (!endDate) {
               const errorMessage = t("end_date_required")
               setErrors("rentalPeriod", [errorMessage])
               return
          }

          const diffInMs = endDate.getTime() - startDate.getTime()
          const diffInHours = diffInMs / (1000 * 60 * 60)
          const diffInDays = diffInHours / 24

          switch (frequency.id) {
               case "1":
                    if (diffInDays > 6) {
                         const errorMessage = t("zod_rule_rental_period_invalid_days")
                         setErrors("rentalPeriod", [errorMessage])
                         return
                    }
                    break
               case "2":
                    const diffInWeeks = diffInDays / 7

                    if (diffInWeeks < 1 || diffInWeeks > 4) {
                         const errorMessage = t("zod_rule_rental_period_invalid_weeks")
                         setErrors("rentalPeriod", [errorMessage])
                         return
                    }
                    break
               case "3":
                    const diffInMonths = diffInDays / 30
                    if (diffInMonths < 2 || diffInMonths > 12) {
                         const errorMessage = t("zod_rule_rental_period_invalid_months")
                         setErrors("rentalPeriod", [errorMessage])
                         return
                    }
                    break
               default:
                    break
          }

          setRentalPeriod(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0])
          clearErrors("rentalPeriod")
          handleNavigation()

          console.log("fsdfdfsd", getErrors("rentalPeriod"))
     }

     const resetCalendar = () => {
          setStartDate(rawStartDate)
          setEndDate(rawEndDate)

          calendarRef.current?.resetSelections()

          setCalendarKey((prev) => prev + 1)
          handleNavigation()
     }

     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(rentalPeriod.start, rentalPeriod.end, locale)
     const rentalPeriodErrors = getErrors("rentalPeriod")

     // @ts-ignore
     const themeColor = theme.colors.text

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.title, { color: theme.colors.primary }]}>{t("rental_period_title")}</Text>

                    <PaperSelect
                         label={t("rental_frequency_placeholder")}
                         value={frequency.value}
                         onSelection={(value: any) => {
                              console.log("value", value.text)
                              console.log("frequency.value", frequency)

                              setFrequency({
                                   list: frequency.list,
                                   value: value.text,
                                   selectedList: value.selectedList,
                                   error: "",
                                   id: value.selectedList[0]._id,
                              })
                         }}
                         arrayList={[...frequency.list]}
                         selectedArrayList={frequency.selectedList}
                         errorText={frequency.error}
                         multiEnable={false}
                    />

                    <CalendarPicker key={calendarKey} ref={calendarRef} initialDate={new Date()} selectedStartDate={startDate ? startDate.toString() : undefined} selectedEndDate={endDate ? endDate.toString() : undefined} weekdays={[t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]} months={[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")]} previousTitle={t("previous")} nextTitle={t("next")} startFromMonday allowRangeSelection minDate={new Date()} todayBackgroundColor="#f2e6ff" selectedDayColor="#7300e6" textStyle={{ color: themeColor }} onDateChange={handleDateChange} selectedRangeStyle={{ backgroundColor: theme.colors.primary }} />
                    <View style={styles.selectedDates}>
                         <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                              {t("start_date_label")}: {rentalStartDate}
                         </Text>
                         <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                              {t("end_date_label")}: {rentalEndDate}
                         </Text>
                         {rentalPeriodErrors &&
                              rentalPeriodErrors.map((err, index) => (
                                   <Text key={index} style={[styles.errorText, { color: theme.colors.error }]}>
                                        {err}
                                   </Text>
                              ))}
                    </View>
                    <View style={styles.buttons}>
                         <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
                              {t("confirm_button")}
                         </Button>

                         <Button mode="outlined" onPress={resetCalendar} style={styles.cancelButton}>
                              {t("cancel_button")}
                         </Button>
                    </View>
               </ScrollView>
          </SafeAreaView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 20,
     },
     content: {
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     title: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
     },
     selectedDates: {
          marginVertical: 20,
     },
     dateText: {
          fontSize: 16,
          textAlign: "center",
     },
     errorText: {
          textAlign: "center",
          marginTop: 10,
     },
     buttons: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
     },
     cancelButton: {
          flex: 1,
          marginRight: 10,
     },
     confirmButton: {
          flex: 1,
          marginLeft: 10,
     },
})
