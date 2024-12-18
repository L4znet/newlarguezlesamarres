import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Modal, Portal, Button, Text } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import CalendarPicker from "react-native-calendar-picker"

interface CalendarModalProps {
     visible: boolean
     onDismiss: () => void
     onSelect: (startDate: string, endDate: string | null) => void
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onDismiss, onSelect }) => {
     const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
     const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const localeMap = {
          en: enUS,
          fr: fr,
     }

     const handleDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
          if (type === "END_DATE") {
               setSelectedEndDate(date)
          } else {
               setSelectedStartDate(date)
               setSelectedEndDate(null)
          }
     }

     const formatDate = (date: Date | null): string => {
          if (!date) return t("none")
          return format(date, "dd MMMM yyyy", { locale: localeMap[locale] || enUS })
     }

     const handleConfirm = () => {
          if (selectedStartDate) {
               onSelect(selectedStartDate.toISOString().split("T")[0], selectedEndDate ? selectedEndDate.toISOString().split("T")[0] : null)
          }
          onDismiss()
     }

     return (
          <Portal>
               <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.title}>{t("rental_period_title")}</Text>
                    <CalendarPicker selectedRangeStyle={{ backgroundColor: "#cdafea" }} weekdays={[t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]} months={[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")]} previousTitle={t("previous")} nextTitle={t("next")} startFromMonday allowRangeSelection minDate={new Date()} todayBackgroundColor="#f2e6ff" selectedDayColor="#7300e6" onDateChange={handleDateChange} />
                    <View style={styles.selectedDates}>
                         <Text style={styles.dateText}>
                              {t("start_date_label")}: {formatDate(selectedStartDate)}
                         </Text>
                         <Text style={styles.dateText}>
                              {t("end_date_label")}: {formatDate(selectedEndDate)}
                         </Text>
                    </View>
                    <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
                         {t("confirm_dates_button")}
                    </Button>
               </Modal>
          </Portal>
     )
}

const styles = StyleSheet.create({
     modalContainer: {
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
     },
     title: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#7300e6",
     },
     selectedDates: {
          marginVertical: 20,
     },
     dateText: {
          fontSize: 16,
          textAlign: "center",
          color: "#7300e6",
     },
     confirmButton: {
          marginTop: 20,
     },
})

export default CalendarModal
