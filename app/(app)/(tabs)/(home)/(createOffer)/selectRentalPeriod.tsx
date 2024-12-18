import React, { useState } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { Button, Text } from "react-native-paper"
import { useRouter } from "expo-router"
import CalendarPicker from "react-native-calendar-picker"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { useTheme } from "react-native-paper"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

export default function selectRentalPeriod() {
     const { rentalPeriod, setRentalPeriod } = useOfferExternalScreenStore()
     const [startDate, setStartDate] = useState<Date | null>(rentalPeriod.startDate ? new Date(rentalPeriod.startDate) : null)
     const [endDate, setEndDate] = useState<Date | null>(rentalPeriod.endDate ? new Date(rentalPeriod.endDate) : null)
     const [error, setError] = useState<string | null>(null)
     const router = useRouter()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const theme = useTheme()

     const localeMap = {
          en: enUS,
          fr: fr,
     }

     const handleDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
          if (type === "END_DATE") {
               setEndDate(date)
               setError(null)
          } else {
               setStartDate(date)
               setEndDate(null)
          }
     }

     const formatDate = (date: Date | null): string => {
          if (!date) return t("none")
          return format(date, "dd MMMM yyyy", { locale: localeMap[locale] || enUS })
     }

     const handleConfirm = () => {
          if (!startDate) {
               setError(t("start_date_required"))
               return
          }
          if (!endDate) {
               setError(t("end_date_required"))
               return
          }
          if (startDate && endDate) {
               setRentalPeriod(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0])
               router.replace("/")
          }
     }

     const handleCancel = () => {
          setStartDate(null)
          setEndDate(null)
          setError(null)
          router.back()
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.title, { color: theme.colors.primary }]}>{t("rental_period_title")}</Text>
                    <CalendarPicker weekdays={[t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]} months={[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")]} previousTitle={t("previous")} nextTitle={t("next")} startFromMonday allowRangeSelection minDate={new Date()} todayBackgroundColor="#f2e6ff" selectedDayColor="#7300e6" textStyle={{ color: theme.colors.text }} onDateChange={handleDateChange} selectedRangeStyle={{ backgroundColor: theme.colors.primary }} />
                    <View style={styles.selectedDates}>
                         <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                              {t("start_date_label")}: {formatDate(startDate)}
                         </Text>
                         <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                              {t("end_date_label")}: {formatDate(endDate)}
                         </Text>
                         {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
                    </View>
                    <View style={styles.buttons}>
                         <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
                              {t("confirm_button")}
                         </Button>
                         <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
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
