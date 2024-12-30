import React, { useState } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Button, Text, useTheme, TextInput, Card, ActivityIndicator } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function SelectLocation() {
     const [searchTerm, setSearchTerm] = useState<string>("")
     const { setLocation, location } = useOfferStore()
     const [validationError, setValidationError] = useState<string | null>(null)
     const [selectedLocation, setSelectedLocation] = useState<{
          city: string
          country: string
          zipcode: string
          address: string
     } | null>(location)
     const { mutate, data, isPending, error } = useLocationSearch()

     const router = useRouter()
     const theme = useTheme()

     const { backPath } = useLocalSearchParams<{ backPath: string }>()

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutate(searchTerm)
               setValidationError(null)
          }
     }

     const validateLocation = (location: any) => {
          const { address } = location

          if ((!address.municipality || !address.city || !address.localName) && (!address.country || !address.postalCode || !address.streetName || !address.streetNumber)) {
               //@TODO Traduction
               setValidationError("La localisation sélectionnée est incomplète. Assurez-vous que la ville, le pays, le code postal et l'adresse sont disponibles.")
               return {
                    city: "",
                    country: "",
                    zipcode: "",
                    address: "",
                    status: "INVALID",
               }
          }

          const validatedLocation = {
               city: address.city || address.municipality || address.localName,
               country: address.country,
               zipcode: address.postalCode,
               address: `${address.streetNumber || ""} ${address.streetName || ""}`.trim(),
               status: "VALIDATED",
          }

          if (validatedLocation.status !== "INVALID") {
               setValidationError(null)
          }

          return validatedLocation
     }

     const handleSelectLocation = (location: any) => {
          const { city, country, zipcode, address, status } = validateLocation(location)

          if (status === "VALIDATED") {
               setSelectedLocation({ city, country, zipcode, address })
               setSearchTerm("")
               mutate("", {
                    onSuccess: () => {},
               })
          }
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }

     const cancelSelection = () => {
          handleNavigation()

          setSelectedLocation({
               city: location.city,
               country: location.country,
               zipcode: location.zipcode,
               address: location.address,
          })
     }

     const confirmSelection = () => {
          if (selectedLocation) {
               setLocation(selectedLocation)
               handleNavigation()
          }
     }
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const currentSelection = selectedLocation?.country && selectedLocation.city && selectedLocation.address && selectedLocation.zipcode ? `${selectedLocation.address}, ${selectedLocation.zipcode} ${selectedLocation.city}, ${selectedLocation.country}` : "Aucune sélection"
     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <TextInput placeholder="Rechercher une localisation" value={searchTerm} onChangeText={setSearchTerm} onEndEditing={handleSearch} />

                    {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}

                    {/*  TODO Traduction*/}
                    {error && <Text style={styles.errorText}>Une erreur est survenue lors de la recherche.</Text>}

                    {validationError && <Text style={styles.errorText}>{validationError}</Text>}

                    {data && data.length > 0 ? (
                         <FlatList
                              data={data}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => (
                                   <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectLocation(item)}>
                                        <Text style={styles.resultText}>{item.address.freeformAddress}</Text>
                                   </TouchableOpacity>
                              )}
                         />
                    ) : (
                         !isPending && searchTerm.trim() !== "" && <Text style={styles.noResultsText}>Aucun résultat trouvé. Essayez un autre mot-clé.</Text>
                    )}

                    <View style={styles.selectionContainer}>
                         <Text style={styles.selectionTitle}>{t("your_selection")}</Text>
                         <Card style={styles.selectionCard}>
                              <Card.Content>
                                   <Text>{currentSelection}</Text>
                              </Card.Content>
                         </Card>
                    </View>

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
