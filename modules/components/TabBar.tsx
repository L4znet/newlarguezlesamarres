import { StyleSheet } from "react-native"
import React from "react"
import { Text, BottomNavigation } from "react-native-paper"
import TabBarButton from "./TabBarButton"
import { Href, router } from "expo-router"

const TabBar = ({ state, descriptors, navigation, insets }: { state: any; descriptors: any; navigation: any; insets: any }) => {
     interface Route {
          key: string
          name: string
          params: any
     }

     interface routeToGo {
          routeToGo: string
     }

     const primaryColor = "#0891b2"
     const greyColor = "#737373"
     return (
          <BottomNavigation.Bar
               navigationState={state}
               safeAreaInsets={insets}
               onTabPress={({ route, preventDefault }) => {
                    const routeName = route.key.split("-")[0]
                    let routeToGo: string = "/(tabs)/" + routeName
                    if (routeName === "index") {
                         routeToGo = "/(tabs)/"
                    }

                    router.push(routeToGo)
               }}
               renderIcon={({ route, focused, color }) => {
                    const { options } = descriptors[route.key]
                    if (options.tabBarIcon) {
                         return options.tabBarIcon({ focused, color, size: 24 })
                    }

                    return null
               }}
               getLabelText={({ route }) => {
                    const { options } = descriptors[route.key]
                    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.title

                    return label
               }}
          />
     )
}

const styles = StyleSheet.create({
     tabbar: {
          position: "absolute",
          bottom: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          marginHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 25,
          borderCurve: "continuous",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          shadowOpacity: 0.1,
     },
})

export default TabBar
