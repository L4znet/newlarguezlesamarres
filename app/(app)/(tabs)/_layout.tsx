import React, { useEffect } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, router, Tabs } from "expo-router"
import TabBar from "@/modules/components/TabBar"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { registerTranslation } from "react-native-paper-dates"

export default function Layout() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const { session } = useAuth()

     useEffect(() => {
          if (!session) {
               router.replace("/(app)/(auth)")
          }
     }, [session])

     registerTranslation("fr", {
          save: "Sauvegarder",
          selectSingle: "Sélectionner une date",
          selectMultiple: "Sélectionner plusieurs dates",
          selectRange: "Sélectionner une période",
          notAccordingToDateFormat(inputFormat) {
               return `Date n'est pas conforme au format ${inputFormat}`
          },
          mustBeHigherThan: (date) => `Doit être postérieur à ${date}`,
          mustBeLowerThan: (date) => `Doit être antérieur à ${date}`,
          mustBeBetween(startDate, endDate) {
               return `Doit être entre ${startDate} et ${endDate}`
          },
          dateIsDisabled: "Date est désactivée",
          previous: "Précédent",
          next: "Suivant",
          typeInDate: "Tapez une date",
          pickDateFromCalendar: "Choisissez une date dans le calendrier",
          close: "Fermer",
          hour: "Heure",
          minute: "Minute",
     })

     registerTranslation("en", {
          save: "Save",
          selectSingle: "Select a date",
          selectMultiple: "Select multiple dates",
          selectRange: "Select a range",
          notAccordingToDateFormat(inputFormat) {
               return `Date is not according to format ${inputFormat}`
          },
          mustBeHigherThan: (date) => `Must be higher than ${date}`,
          mustBeLowerThan: (date) => `Must be lower than ${date}`,
          mustBeBetween(startDate, endDate) {
               return `Must be between ${startDate} and ${endDate}`
          },
          dateIsDisabled: "Date is disabled",
          previous: "Previous",
          next: "Next",
          typeInDate: "Type in a date",
          pickDateFromCalendar: "Pick a date from the calendar",
          close: "Close",
          hour: "Hour",
          minute: "Minute",
     })

     registerTranslation("es", {
          save: "Guardar",
          selectSingle: "Seleccionar una fecha",
          selectMultiple: "Seleccionar varias fechas",
          selectRange: "Seleccionar un rango",
          notAccordingToDateFormat(inputFormat) {
               return `La fecha no es conforme al formato ${inputFormat}`
          },
          mustBeHigherThan: (date) => `Debe ser superior a ${date}`,
          mustBeLowerThan: (date) => `Debe ser inferior a ${date}`,
          mustBeBetween(startDate, endDate) {
               return `Debe estar entre ${startDate} y ${endDate}`
          },
          dateIsDisabled: "La fecha está deshabilitada",
          previous: "Anterior",
          next: "Siguiente",
          typeInDate: "Escriba una fecha",
          pickDateFromCalendar: "Elija una fecha del calendario",
          close: "Cerrar",
          hour: "Hora",
          minute: "Minuto",
     })

     return (
          <Tabs
               tabBar={(props) => <TabBar {...(props as any)} />}
               screenOptions={{
                    headerShown: false,
               }}
          >
               <Tabs.Screen
                    name="(home)"
                    options={{
                         title: t("bottom_bar_(home)/index"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(profile)"
                    options={{
                         title: t("bottom_bar_(profile)"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(offers)"
                    options={{
                         title: t("bottom_bar_(offers)"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name={"file-text"} color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(boats)"
                    options={{
                         title: t("bottom_bar_(boats)"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="anchor" color={color} />,
                    }}
               />
               <Tabs.Screen
                    name="(settings)"
                    options={{
                         title: t("bottom_bar_settings"),
                         tabBarIcon: ({ color }) => <FontAwesome size={28} name="cogs" color={color} />,
                    }}
               />
          </Tabs>
     )
}
