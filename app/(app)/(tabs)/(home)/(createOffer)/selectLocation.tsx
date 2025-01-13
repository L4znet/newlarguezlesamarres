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
     const { setLocation, setErrors, getErrors, setTemporaryLocation, temporaryLocation } = useOfferStore()
     const [validationError, setValidationError] = useState<string | null>(null)

     const { mutate, data, isPending, error: errorFromFetch, reset } = useLocationSearch()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const router = useRouter()
     const theme = useTheme()

     const { backPath } = useLocalSearchParams<{ backPath: string }>()

     const resetScreen = () => {
          setSearchTerm("")
          setValidationError(null)
          setTemporaryLocation({
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

          const schema = z.object({
               city: z.string({ message: t("zod_rule_city_required") }),
               country: z.string({ message: t("zod_rule_country_required") }),
               streetNumber: z.string({ message: t("zod_rule_address_required") }),
               zipcode: z
                    .string({ message: t("zod_rule_zipcode_required") })
                    .nonempty({ message: t("zod_rule_zipcode_required") })
                    .regex(/^\d+$/, { message: t("zod_rule_zipcode_invalid") })
                    .length(5, { message: t("zod_rule_zipcode_too_short") }),

               address: z.string({ message: t("zod_rule_address_required") }),
          })

          const validationResult = schema.safeParse({
               city: municipality,
               country: country,
               zipcode: postalCode,
               streetNumber: streetNumber,
               address: `${streetNumber} ${streetName}`,
          })

          mutate("", {
               onSuccess: () => {
                    reset()
               },
          })

          if (!validationResult.success) {
               const errors = validationResult.error.flatten()
               setErrors("location", [...(errors.fieldErrors.streetNumber || []), ...(errors.fieldErrors.zipcode || []), ...(errors.fieldErrors.address || []), ...(errors.fieldErrors.city || []), ...(errors.fieldErrors.country || []), ...(errors.formErrors || [])])
          } else {
               setErrors("location", [])
               setSearchTerm("")
               setTemporaryLocation({ city: municipality, country: country, zipcode: postalCode, address: streetNumber + " " + streetName })
          }
     }

     const handleNavigation = () => {
          router.back()
     }

     const cancelSelection = () => {
          handleNavigation()
          resetScreen()
     }

     const confirmSelection = () => {
          if (temporaryLocation) {
               setErrors("location", [])
               setLocation(temporaryLocation)
               handleNavigation()
          }
     }

     let currentSelection = ""

     if (temporaryLocation.country && temporaryLocation.city && temporaryLocation.zipcode && temporaryLocation.address) {
          currentSelection = `${temporaryLocation.address}, ${temporaryLocation.zipcode} ${temporaryLocation.city}, ${temporaryLocation.country}`
     } else {
          currentSelection = t("location_not_specified")
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <TextInput placeholder="Rechercher une localisation" value={searchTerm} onChangeText={setSearchTerm} onEndEditing={handleSearch} />

                    {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}

                    {errorFromFetch && <Text style={styles.errorText}>Une erreur est survenue lors de la recherche.</Text>}
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
                    {getErrors("location") &&
                         getErrors("location")?.map((error, index) => (
                              <Text key={index} style={[styles.errorText, { color: theme.colors.error }]}>
                                   {error}
                              </Text>
                         ))}

                    {!isPending && data && data.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                    {data && data.length === 0 && <Text style={styles.noResultsText}>{t("no_results")}</Text>}

                    {temporaryLocation.address && temporaryLocation.country && temporaryLocation.zipcode && temporaryLocation.city && (
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
