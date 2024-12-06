import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { AnimatedFAB, Button, Card, FAB, Text } from "react-native-paper"
import { useState } from "react"
import { router } from "expo-router"

export default function index() {
     const [isExtended, setIsExtended] = useState(false)
     const [visible, setVisible] = useState(true)
     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <Card style={styles.card}>
                              <Card.Content>
                                   <Text variant="titleLarge">Card title</Text>
                                   <Text variant="bodyMedium">Card content</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button>Cancel</Button>
                                   <Button>Ok</Button>
                              </Card.Actions>
                         </Card>
                         <Card style={styles.card}>
                              <Card.Content>
                                   <Text variant="titleLarge">Card title</Text>
                                   <Text variant="bodyMedium">Card content</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button>Cancel</Button>
                                   <Button>Ok</Button>
                              </Card.Actions>
                         </Card>
                         <Card style={styles.card}>
                              <Card.Content>
                                   <Text variant="titleLarge">Card title</Text>
                                   <Text variant="bodyMedium">Card content</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button>Cancel</Button>
                                   <Button>Ok</Button>
                              </Card.Actions>
                         </Card>
                         <Card style={styles.card}>
                              <Card.Content>
                                   <Text variant="titleLarge">Card title</Text>
                                   <Text variant="bodyMedium">Card content</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button>Cancel</Button>
                                   <Button>Ok</Button>
                              </Card.Actions>
                         </Card>
                         <Card style={styles.card}>
                              <Card.Content>
                                   <Text variant="titleLarge">Card title</Text>
                                   <Text variant="bodyMedium">Card content</Text>
                              </Card.Content>
                              <Card.Actions>
                                   <Button>Cancel</Button>
                                   <Button>Ok</Button>
                              </Card.Actions>
                         </Card>
                    </ScrollView>
               </SafeAreaView>
               <FAB icon="plus" style={styles.fab} onPress={() => router.navigate("/(app)/(tabs)/(boats)/addBoat")} />
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     scrollViewBoats: {
          width: "90%",
          rowGap: 20,
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
