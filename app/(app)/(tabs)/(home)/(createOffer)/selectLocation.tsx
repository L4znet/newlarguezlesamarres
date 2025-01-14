import React, { useEffect, useState } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Button, Text, useTheme, TextInput, Card, ActivityIndicator } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { Controller } from "react-hook-form"

const SelectLocation = ({
     register,
     control,
     searchTerm,
     setSearchTerm,
     handleSearch,
     handleSelectLocation,
     confirmSelection,
     cancelSelection,
     isPending,
     errorFromFetch,
     locationData,
     errors,
     temporaryLocation,
     setLocation,
}: {
     register: any
     control: any
     searchTerm: string
     setSearchTerm: React.Dispatch<React.SetStateAction<string>>
     handleSearch: () => void
     handleSelectLocation: (item: any) => void
     confirmSelection: () => void
     cancelSelection: () => void
     isPending: boolean
     errorFromFetch: any
     locationData: any
     errors: any
     temporaryLocation: {
          city: string
          country: string
          zipcode: string
          address: string
     }
     setLocation: React.Dispatch<React.SetStateAction<any>>
}) => {
     const theme = useTheme()
     const { t } = useTranslation()

     useEffect(() => {
          register("location")
     }, [register])

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <Button mode="contained" onPress={() => confirmSelection()} style={styles.actionButton}>
                         {t("confirm")}
                    </Button>

                    <Button mode="outlined" onPress={() => cancelSelection()} style={styles.actionButton}>
                         {t("cancel")}
                    </Button>
               </ScrollView>
          </SafeAreaView>
     )
}

export default SelectLocation

const styles = StyleSheet.create({
     container: {
          width: "100%",
          alignSelf: "center",
          height: "100%",
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
     noResultsText: {
          textAlign: "center",
          marginTop: 20,
          fontSize: 16,
     },
     errorText: {
          marginTop: 5,
     },
     loading: {
          marginVertical: 20,
     },
     actionButton: {
          marginTop: 20,
     },
     selectionContainer: {
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
})
