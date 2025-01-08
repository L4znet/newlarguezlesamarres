import React, { createRef, useState } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { Button, Text } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import CalendarPicker from "react-native-calendar-picker"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useTheme } from "react-native-paper"
import { useOfferStore } from "@/modules/stores/offerStore"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { z } from "zod"

export default function SelectRentalPeriod() {
     const { rentalPeriod, setRentalPeriod, setTemporaryStartDate, setTemporaryEndDate, temporaryEndDate, temporaryStartDate, setErrors, clearErrors, getErrors } = useOfferStore()
     const [calendarKey, setCalendarKey] = useState(0)

     const router = useRouter()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const theme = useTheme()
     const { backPath } = useLocalSearchParams<{ backPath: string }>()
     const calendarRef = createRef<CalendarPicker>()

     const [startDate, setStartDate] = useState<Date | null>(null)
     const [endDate, setEndDate] = useState<Date | null>(null)

     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(temporaryStartDate, temporaryEndDate, locale)

     const rentalPeriodErrors = getErrors("rentalPeriod")
     const handleDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
          if (type === "END_DATE") {
               setTemporaryEndDate(date)
               clearErrors("rentalPeriod")
          } else {
               setTemporaryStartDate(date)
               setTemporaryEndDate(null)
               clearErrors("rentalPeriod")
          }
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }

     const handleConfirm = () => {
          if (!rentalStartDate) {
               const errorMessage = t("zod_rule_rental_period_required")
               setErrors("rentalPeriod", [errorMessage])
               return
          }

          if (!rentalEndDate) {
               const errorMessage = t("zod_rule_end_date_required")
               setErrors("rentalPeriod", [errorMessage])
               return
          }

          const startDateParsed = temporaryStartDate ? temporaryStartDate?.toISOString().split("T")[0] : ""
          const endDateParsed = temporaryEndDate ? temporaryEndDate?.toISOString().split("T")[0] : ""

          const schema = z
               .object({
                    start: z.string().refine((value) => value !== "", { message: t("zod_rule_rental_period_required") }),
                    end: z.string().refine((value) => value !== "", { message: t("zod_rule_end_date_required") }),
               })
               .refine(
                    (value) => {
                         const { start, end } = value

                         const startDate = new Date(start)
                         const endDate = new Date(end)

                         const diffTime = Math.abs(endDate.getTime() - startDate.getTime())

                         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                         return diffDays >= 2
                    },
                    { message: t("zod_rule_period_too_short") }
               )

          const validationResult = schema.safeParse({ start: startDateParsed, end: endDateParsed })

          if (!validationResult.success) {
               const errors = validationResult.error.flatten()
               setErrors("rentalPeriod", [...(errors.fieldErrors.start || []), ...(errors.fieldErrors.end || []), ...(errors.formErrors || [])])
               return
          }

          setRentalPeriod(startDateParsed, endDateParsed)
          clearErrors("rentalPeriod")
          handleNavigation()
     }

     const resetCalendar = () => {
          setTemporaryStartDate(null)
          setTemporaryEndDate(null)
          clearErrors("rentalPeriod")
          setRentalPeriod("", "")

          calendarRef.current?.resetSelections()

          setCalendarKey((prev) => prev + 1)
          handleNavigation()
     }

     // @ts-ignore
     const themeColor = theme.colors.text

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.title, { color: theme.colors.primary }]}>{t("rental_period_title")}</Text>

                    <CalendarPicker
                         key={calendarKey}
                         ref={calendarRef}
                         initialDate={new Date()}
                         selectedStartDate={temporaryStartDate ? temporaryStartDate.toString() : undefined}
                         selectedEndDate={temporaryEndDate ? temporaryEndDate.toString() : undefined}
                         weekdays={[t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]}
                         months={[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")]}
                         previousTitle={t("previous")}
                         nextTitle={t("next")}
                         startFromMonday
                         allowRangeSelection
                         minDate={new Date()}
                         todayBackgroundColor="#f2e6ff"
                         selectedDayColor="#7300e6"
                         textStyle={{ color: themeColor }}
                         onDateChange={handleDateChange}
                         selectedRangeStyle={{ backgroundColor: theme.colors.primary }}
                    />

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
          marginLeft: 10,
     },
     confirmButton: {
          flex: 1,
          marginLeft: 10,
     },
})
