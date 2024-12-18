import React, { useState } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from "react-native"
import { Button, Text, useTheme, TextInput } from "react-native-paper"
import { useRouter } from "expo-router"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

export default function selectLocation() {
     const [searchTerm, setSearchTerm] = useState<string>("")
     const [validationError, setValidationError] = useState<string | null>(null) // Gestion des erreurs de validation
     const { mutate, data, isPending, error } = useLocationSearch()
     const { setLocation } = useOfferExternalScreenStore()
     const router = useRouter()
     const theme = useTheme()

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutate(searchTerm)
               setValidationError(null) // Réinitialiser les erreurs en cas de nouvelle recherche
          }
     }

     const validateLocation = (
          location: any
     ): {
          city: string
          country: string
          zipCode: string
          address: string
     } => {
          const { address } = location

          if ((!address.municipality || !address.city || !address.localName) && (!address.country || !address.postalCode || !address.streetName || !address.streetNumber)) {
               console.log({
                    localName: address.localName,
                    city: address.city,
                    municipality: address.municipality,
                    country: address.country,
                    postalCode: address.postalCode,
                    streetNumber: address.streetNumber,
                    streetName: address.streetName,
               })

               setValidationError("La localisation sélectionnée est incomplète. Assurez-vous que la ville, le pays, le code postal et l'adresse sont disponibles.")
               return false
          }

          location = {
               city: address.city || address.municipality || address.localName,
               country: address.country,
               zipCode: address.postalCode,
               address: `${address.streetNumber || ""} ${address.streetName || ""}`,
               status: "VALIDATED",
          }

          return location
     }

     const handleSelectLocation = (location: any) => {
          const { city, country, zipCode, address, status } = validateLocation(location)

          if (status === "VALIDATED") {
               setLocation({
                    city,
                    country,
                    zipCode,
                    address,
               })
               router.replace("/")
          }
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <ScrollView contentContainerStyle={styles.content}>
                    <TextInput placeholder="Rechercher une localisation" value={searchTerm} onChangeText={setSearchTerm} onEndEditing={handleSearch} />

                    {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}

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

                    <Button mode="contained" onPress={() => router.back()} style={styles.cancelButton}>
                         Annuler
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
          borderBottomColor: "#ccc",
     },
     resultText: {
          fontSize: 16,
          color: "white",
     },
     noResultsText: {
          textAlign: "center",
          marginTop: 20,
          color: "#666",
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
     cancelButton: {
          marginTop: 20,
     },
})
