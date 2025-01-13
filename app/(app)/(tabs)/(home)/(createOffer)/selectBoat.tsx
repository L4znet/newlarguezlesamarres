import React, { useEffect } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { Button, useTheme, Text, Icon, ActivityIndicator } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useBoats } from "@/modules/hooks/boats/useBoats"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function SelectBoat() {
     const theme = useTheme()
     const router = useRouter()
     const { data: boats, isPending, error } = useBoats()
     const { selectBoat, selectedBoatId } = useOfferStore()
     const { backPath } = useLocalSearchParams<{ backPath: string }>()
     const [newSelectedBoat, setNewSelectedBoat] = React.useState<string | null>(selectedBoatId)

     const handleNavigation = () => {
          router.back()
     }

     const handleSelectBoat = (boat: any) => {
          setNewSelectedBoat(boat.id)
     }

     const handleCancelSelection = () => {
          handleNavigation()
          setNewSelectedBoat(null)
          selectBoat(null)
     }

     const handleConfirmSelection = () => {
          handleNavigation()
          selectBoat(newSelectedBoat as string)
     }

     // @ts-ignore
     const themeColorText = theme.colors.text

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const EmptyList = () => {
          return (
               <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: themeColorText }}>{t("select_boat_empty_message")}</Text>
               </View>
          )
     }

     return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
               <Text style={[styles.title, { color: theme.colors.primary }]}>{t("select_boat")}</Text>
               {isPending && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loading} />}
               {error && <Text style={styles.errorText}>Une erreur est survenue lors de la récupération des bateaux.</Text>}
               {boats && (
                    <FlatList
                         ListEmptyComponent={EmptyList}
                         data={boats}
                         keyExtractor={(item) => item.id}
                         renderItem={({ item }) => {
                              return (
                                   <Button mode={"contained"} icon={newSelectedBoat === item.id ? "check" : ""} style={newSelectedBoat === item.id ? [styles.boatItem, { backgroundColor: theme.colors.primary }] : [styles.boatItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleSelectBoat(item)}>
                                        <Text style={newSelectedBoat === item.id ? [styles.boatName, { color: theme.colors.background }] : styles.boatName}>{item.boatName}</Text>
                                   </Button>
                              )
                         }}
                    />
               )}
               <Button mode="contained" onPress={() => handleConfirmSelection()} style={styles.button}>
                    {t("confirm_button")}
               </Button>
               <Button mode="outlined" onPress={() => handleCancelSelection()} style={styles.button}>
                    {t("cancel_button")}
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
          paddingVertical: 30,
          marginVertical: 10,
          fontSize: 16,
          borderRadius: 10,
     },
     boatName: {
          fontSize: 16,
          fontWeight: "bold",
     },
     loading: {
          marginVertical: 20,
     },
     errorText: {
          color: "red",
          textAlign: "center",
          marginBottom: 20,
     },
     button: {
          marginTop: 20,
     },
})
