import React, { useEffect } from "react"
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { Button, useTheme, Text, Icon, ActivityIndicator } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useBoats } from "@/modules/hooks/boats/useBoats"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function SelectBoat({ handleSelectBoat, selectedBoatId }: { handleSelectBoat: (boat: any) => void; selectedBoatId: string | null }) {
     const theme = useTheme()
     const router = useRouter()

     const { backPath } = useLocalSearchParams<{ backPath: string }>()
     const { data: boats, isPending, error } = useBoats()

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
          <View>
               <Text style={styles.selectionTitle}>{t("select_boat_title")}</Text>

               {boats && (
                    <View>
                         <FlatList
                              nestedScrollEnabled={true}
                              ListEmptyComponent={EmptyList}
                              data={boats}
                              keyExtractor={(item) => item.id}
                              renderItem={({ item }) => {
                                   return (
                                        <Button mode={"contained"} icon={selectedBoatId === item.id ? "check" : ""} style={selectedBoatId === item.id ? [styles.boatItem, { backgroundColor: theme.colors.primary }] : [styles.boatItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleSelectBoat(item.id)}>
                                             <Text style={selectedBoatId === item.id ? [styles.boatName, { color: theme.colors.background }] : styles.boatName}>{item.boatName}</Text>
                                        </Button>
                                   )
                              }}
                         />
                    </View>
               )}
          </View>
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
     selectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
     },
})
