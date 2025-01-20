import { StyleSheet } from "react-native"
import React from "react"
import { Text, BottomNavigation } from "react-native-paper"
import TabBarButton from "./TabBarButton"
import { Href, router } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

interface Route {
     key: string
     name: string
     params: any
     title?: string
}

interface TabBarProps {
     state: {
          routes: Route[]
          index: number
     }
     descriptors: any
     navigation: any
     insets: any
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, insets }) => {
     const primaryColor = "#0891b2"
     const greyColor = "#737373"

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const handleTabPress = ({ route }: { route: Route }) => {
          const routeName = route.key.split("-")[0]
          const routeToGo = routeName === "/(tabs)/(home)" ? "/(tabs)/(home)" : `/(tabs)/${routeName}`
          router.push(routeToGo as Href)
     }

     const renderTabIcon = ({ route, focused, color }: { route: Route; focused: boolean; color: string }) => {
          const descriptor = descriptors[route.key]
          if (descriptor?.options?.tabBarIcon) {
               return descriptor.options.tabBarIcon({ focused, color, size: 24 })
          }
          return null
     }

     const getTabLabel = ({ route }: { route: Route }) => {
          const descriptor = descriptors[route.key]
          return descriptor?.options?.tabBarLabel ?? descriptor?.options?.title ?? route.title ?? route.name
     }

     const filteredState = {
          ...state,
     }

     return <BottomNavigation.Bar navigationState={filteredState} safeAreaInsets={insets} onTabPress={handleTabPress} renderIcon={renderTabIcon} getLabelText={getTabLabel} />
}

export default TabBar
