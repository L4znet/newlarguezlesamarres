import React from "react"
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native"
import { ActivityIndicator, Card, RadioButton, useTheme } from "react-native-paper"
import { useBoats } from "@/modules/hooks/boats/useBoats"

export default function SelectBoat({ onSelect }: { onSelect: (boatId: string) => void }) {
     const { data: boats, isLoading, error } = useBoats()
     const [selectedBoatId, setSelectedBoatId] = React.useState<string | null>(null)
     const theme = useTheme()

     if (isLoading) {
          return (
               <View style={styles.loader}>
                    <ActivityIndicator animating={true} size="large" />
               </View>
          )
     }

     if (error) {
          return (
               <View style={styles.error}>
                    <Text>Erreur lors de la récupération des bateaux</Text>
               </View>
          )
     }

     const render = ({
          item,
     }: {
          item: {
               boatId: string
               boatName: string
               boatDescription: string
          }
     }) => {
          return (
               <TouchableOpacity
                    onPress={() => {
                         setSelectedBoatId(item.boatId)
                         onSelect(item.boatId)
                    }}
                    style={[styles.cardContainer, selectedBoatId === item.boatId && styles.selectedCard]}
               >
                    <Card style={styles.card} theme={theme}>
                         <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    </Card>
               </TouchableOpacity>
          )
     }

     return <FlatList data={boats} keyExtractor={(item) => item.boatId} renderItem={render} style={styles.container} />
}

const styles = StyleSheet.create({
     loader: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     container: {
          height: "80%",
          borderWidth: 3,
          borderColor: "blue",
     },
     error: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     cardContainer: {
          padding: 10,
          backgroundColor: "red",
     },
     selectedCard: {
          borderWidth: 2,
          borderColor: "blue",
          borderRadius: 8,
     },
     card: {
          padding: 10,
     },
})
