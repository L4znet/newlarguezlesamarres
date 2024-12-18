import React, { useEffect } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native"
import { Button, useTheme, Text } from "react-native-paper"
import { useRouter } from "expo-router"
import { useBoats } from "@/modules/hooks/boats/useBoats"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

export default function SelectBoat() {
     const theme = useTheme()
     const router = useRouter()
     const { data: boats, isPending, error } = useBoats()
     const { selectBoat } = useOfferExternalScreenStore()

     const handleSelectBoat = (boat: any) => {
          selectBoat(boat.id)
          router.replace("/(app)/(tabs)/(home)/createOffer")
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <Text style={[styles.title, { color: theme.colors.primary }]}>Sélectionnez un bateau</Text>
               {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}
               {error && <Text style={styles.errorText}>Une erreur est survenue lors de la récupération des bateaux.</Text>}
               {boats && (
                    <FlatList
                         data={boats}
                         keyExtractor={(item) => item.id}
                         renderItem={({ item }) => (
                              <Button mode={"outlined"} style={styles.boatItem} onPress={() => handleSelectBoat(item)}>
                                   <Text style={[styles.boatName, { color: theme.colors.text }]}>{item.boatName}</Text>
                              </Button>
                         )}
                    />
               )}
               <Button mode="outlined" onPress={() => router.back()} style={styles.cancelButton}>
                    Annuler
               </Button>
          </SafeAreaView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 20,
          marginVertical: 20,
          width: "90%",
          alignSelf: "center",
     },
     title: {
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
     },
     boatItem: {
          padding: 5,
          marginVertical: 10,
     },
     boatName: {
          fontSize: 16,
          color: "#FFF",
     },
     loading: {
          marginVertical: 20,
     },
     errorText: {
          color: "red",
          textAlign: "center",
          marginBottom: 20,
     },
     cancelButton: {
          marginTop: 20,
     },
})
