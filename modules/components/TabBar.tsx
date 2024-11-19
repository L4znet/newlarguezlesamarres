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
     isUserLoggedIn: boolean
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, insets, isUserLoggedIn }) => {
     const primaryColor = "#0891b2"
     const greyColor = "#737373"

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const handleTabPress = ({ route }: { route: Route }) => {
          const routeName = route.key.split("-")[0]
          const routeToGo = routeName === "index" ? "/(tabs)" : `/(tabs)/${routeName}`
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
          const labelKey = `bottom_bar_${route.name}`
          return t(labelKey) ?? descriptors[route.key]?.options?.tabBarLabel ?? descriptors[route.key]?.options?.title ?? route.title ?? route.name
     }

     const filteredRoutes = state.routes.filter((route) => {
          if (!isUserLoggedIn) {
               return !["settings"].includes(route.name)
          }
          return true
     })

     const filteredState = {
          ...state,
          routes: filteredRoutes,
     }

     return <BottomNavigation.Bar navigationState={filteredState} safeAreaInsets={insets} onTabPress={handleTabPress} renderIcon={renderTabIcon} getLabelText={getTabLabel} />
}

export default TabBar
