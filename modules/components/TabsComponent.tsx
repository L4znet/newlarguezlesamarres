import React, { useState, useRef } from "react"
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from "react-native"
import { Surface, useTheme } from "react-native-paper"

const { width: screenWidth } = Dimensions.get("window")

const TabsComponent = ({ tabLabels, children }: { tabLabels: string[]; children: React.ReactNode[] }) => {
     const theme = useTheme()
     const [activeIndex, setActiveIndex] = useState(0)
     const translateX = useRef(new Animated.Value(0)).current

     const handleTabPress = (index: number) => {
          setActiveIndex(index)
          Animated.spring(translateX, {
               toValue: index * screenWidth,
               useNativeDriver: true,
          }).start()
     }

     return (
          <View style={styles.container}>
               <Surface style={[styles.tabHeader, { backgroundColor: theme.colors.surface }]}>
                    {tabLabels.map((label, index) => {
                         console.log({
                              label,
                              index,
                         })

                         return (
                              <TouchableOpacity key={index} style={[styles.tabButton, activeIndex === index && { borderBottomColor: theme.colors.primary }]} onPress={() => handleTabPress(index)}>
                                   <Text style={[styles.tabText, activeIndex === index && { color: theme.colors.primary }]}>{label}</Text>
                              </TouchableOpacity>
                         )
                    })}
               </Surface>

               <Animated.View
                    style={[
                         styles.tabContent,
                         {
                              transform: [{ translateX: Animated.multiply(translateX, -1) }],
                         },
                    ]}
               >
                    {children.map((child, index) => (
                         <View key={index} style={{ width: "100%", height: "100%", flex: 1 }}>
                              {child}
                         </View>
                    ))}
               </Animated.View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          width: "100%",
          height: "100%",
     },
     tabHeader: {
          flexDirection: "row",
     },
     tabButton: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          borderBottomWidth: 2,
          borderBottomColor: "transparent",
          height: 50,
     },
     tabText: {
          fontSize: 16,
          fontWeight: "600",
          color: "#666",
     },
     tabContent: {
          flexDirection: "row",
          width: screenWidth * 3,
          flex: 1,
     },
})

export default TabsComponent
