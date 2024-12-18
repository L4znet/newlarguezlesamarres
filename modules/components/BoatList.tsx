import React, { useEffect, useState } from "react"
import { View, FlatList, StyleSheet } from "react-native"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { Button, Card, FAB, Text } from "react-native-paper"
import Slideshow from "@/modules/components/Slideshow"
import { router } from "expo-router"
import { deleteBoatUseCase } from "@/modules/application/boats/deleteBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useBoats } from "@/modules/hooks/boats/useBoats"
import { useDeleteBoat } from "@/modules/hooks/boats/useDeleteBoat"

const BoatList = () => {
     const { data: boats, isPending, error } = useBoats()

     const deleteBoat = useDeleteBoat()

     if (isPending) {
          return (
               <View style={styles.container}>
                    <Text>Chargement des bateaux...</Text>
               </View>
          )
     }

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>Rien à afficher pour le moment</Text>
               </View>
          )
     }

     const renderItem = ({ item }: { item: BoatEntity }) => {
          return (
               <Card key={item.id} style={styles.card}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    <Card.Content>
                         <Text>ID : {item.id}</Text>
                         <Text>Capacité : {item.boatCapacity}</Text>
                         <Text>Type : {item.boatType}</Text>
                    </Card.Content>
                    <Card.Actions>
                         <Button onPress={() => router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat", params: { boatId: item.id } })}>Modifier</Button>
                         <Button loading={deleteBoat.isPending} onPress={async () => deleteBoat.mutate(item.id)}>
                              Supprimer
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     return <FlatList data={boats} ListEmptyComponent={EmptyList} keyExtractor={(item) => item.id} renderItem={renderItem} />
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     safeView: {
          width: "100%",
          rowGap: 20,
          justifyContent: "center",
          alignItems: "center",
     },
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
     },
})

export default BoatList
