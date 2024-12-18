import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Modal, Portal, Button, Text } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import CalendarPicker from "react-native-calendar-picker"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"

interface CalendarModalProps {
     visible: boolean
     onDismiss: () => void
     onSelect: (startDate: string, endDate: string) => void
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onDismiss, onSelect }) => {
     const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
     const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
     const [error, setError] = useState<string | null>(null)

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const localeMap = {
          en: enUS,
          fr: fr,
     }

     const handleDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
          if (type === "END_DATE") {
               setSelectedEndDate(date)
               setError(null)
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
          if (!selectedStartDate) {
               setError(t("start_date_required"))
               return
          }
          if (!selectedEndDate) {
               setError(t("end_date_required"))
               return
          }
          if (selectedStartDate && selectedEndDate) {
               onSelect(selectedStartDate.toISOString().split("T")[0], selectedEndDate.toISOString().split("T")[0])
          }
          onDismiss()
     }

     const handleCancel = () => {
          setSelectedStartDate(null)
          setSelectedEndDate(null)
          setError(null)
          onDismiss()
     }

     return (
          <Portal>
               <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.title}>{t("rental_period_title")}</Text>
                    <CalendarPicker weekdays={[t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]} months={[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")]} previousTitle={t("previous")} nextTitle={t("next")} startFromMonday allowRangeSelection minDate={new Date()} todayBackgroundColor="#f2e6ff" selectedDayColor="#7300e6" onDateChange={handleDateChange} selectedRangeStyle={{ backgroundColor: "#cdafea" }} />
                    <View style={styles.selectedDates}>
                         <Text style={styles.dateText}>
                              {t("start_date_label")}: {formatDate(selectedStartDate)}
                         </Text>
                         <Text style={styles.dateText}>
                              {t("end_date_label")}: {formatDate(selectedEndDate)}
                         </Text>
                         {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>
                    <View style={styles.buttons}>
                         <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
                              {t("confirm_button")}
                         </Button>
                         <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
                              {t("cancel_button")}
                         </Button>
                    </View>
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
     errorText: {
          color: "red",
          textAlign: "center",
          marginTop: 10,
     },
     buttons: {
          flexDirection: "row",
          justifyContent: "space-between",
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

export default CalendarModal
