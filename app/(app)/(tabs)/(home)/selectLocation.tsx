import React, { useState } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Button, Text, useTheme, TextInput, Card, ActivityIndicator } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { z } from "zod"

export default function SelectLocation() {
     const [searchTerm, setSearchTerm] = useState<string>("")
     const { setLocation, location, setErrors, getErrors } = useOfferStore()
     const [validationError, setValidationError] = useState<string | null>(null)
     const [selectedLocation, setSelectedLocation] = useState<{
          city: string
          country: string
          zipcode: string
          address: string
     } | null>(null)

     const { mutate, data, isPending, error, reset } = useLocationSearch()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const router = useRouter()
     const theme = useTheme()

     const { backPath } = useLocalSearchParams<{ backPath: string }>()

     const resetScreen = () => {
          setSearchTerm("")
          setValidationError(null)
          setSelectedLocation({
               city: "",
               country: "",
               zipcode: "",
               address: "",
          })
          setLocation({
               city: "",
               country: "",
               zipcode: "",
               address: "",
          })
     }

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutate(searchTerm)
               setValidationError(null)
          }
     }

     const handleSelectLocation = (location: any) => {
          const { streetNumber, streetName, municipality, country, postalCode } = location.address

          console.log(selectedLocation)

          setSelectedLocation({ city: municipality, country: country, zipcode: postalCode, address: streetNumber + " " + streetName })
          setSearchTerm("")
          mutate("", {
               onSuccess: () => {
                    reset()
               },
          })
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }

     const cancelSelection = () => {
          handleNavigation()
          resetScreen()
     }

     const confirmSelection = () => {
          if (selectedLocation) {
               const schema = z.object({
                    city: z.string().nonempty(),
                    country: z.string().nonempty(),
                    zipcode: z
                         .string()
                         .nonempty()
                         .length(5, { message: t("zod_rule_zipcode_too_short") })
                         .regex(/^\d+$/, { message: t("zod_rule_zipcode_invalid") }),
                    address: z.string().nonempty(),
               })

               const validationResult = schema.safeParse({
                    city: selectedLocation?.city,
                    country: selectedLocation?.country,
                    zipcode: selectedLocation?.zipcode,
                    address: selectedLocation?.address,
               })

               if (!validationResult.success) {
                    console.log("Validation error", validationResult.error)

                    const errors = validationResult.error.flatten()
                    setErrors("rentalPeriod", [...(errors.fieldErrors.zipcode || []), ...(errors.fieldErrors.address || []), ...(errors.fieldErrors.city || []), ...(errors.fieldErrors.country || []), ...(errors.formErrors || [])])
                    return
               }
               console.log("----------------------------------------------------")
               console.log("fffffffff", validationResult.success)
               console.log("dfsfdssfdq", selectedLocation)

               setLocation(selectedLocation)
               handleNavigation()
          }
     }

     let currentSelection = ""

     if (selectedLocation?.country && selectedLocation?.city && selectedLocation?.zipcode && selectedLocation?.address) {
          currentSelection = `${selectedLocation?.address}, ${selectedLocation?.zipcode} ${selectedLocation?.city}, ${selectedLocation?.country}`
     } else {
          currentSelection = t("location_not_specified")
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <TextInput placeholder="Rechercher une localisation" value={searchTerm} onChangeText={setSearchTerm} onEndEditing={handleSearch} />

                    {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}

                    {error && <Text style={styles.errorText}>Une erreur est survenue lors de la recherche.</Text>}
                    {data && data.length > 0 && (
                         <FlatList
                              data={data}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => (
                                   <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectLocation(item)}>
                                        <Text style={styles.resultText}>{item.address.freeformAddress}</Text>
                                   </TouchableOpacity>
                              )}
                         />
                    )}

                    {!isPending && data && data.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                    {data && data.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                    {selectedLocation?.address && selectedLocation.country && selectedLocation.zipcode && selectedLocation.city && (
                         <View style={styles.selectionContainer}>
                              <Text style={styles.selectionTitle}>{t("your_selection")}</Text>
                              <Card style={styles.selectionCard}>
                                   <Card.Content>
                                        <Text>{currentSelection}</Text>
                                   </Card.Content>
                              </Card>
                         </View>
                    )}

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

const styles = StyleSheet.create({
     container: {
          flex: 1,
          width: "100%",
          alignSelf: "center",
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
          textAlign: "center",
          marginTop: 20,
          color: "red",
          fontSize: 16,
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
