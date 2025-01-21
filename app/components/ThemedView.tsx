import { View, type ViewProps } from "react-native"

import { useThemeColor } from "../../modules/hooks/useThemeColor"
import React from "react"

export type ThemedViewProps = ViewProps & {
     lightColor?: string
     darkColor?: string
}

export default function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
     const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background") as string

     return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
