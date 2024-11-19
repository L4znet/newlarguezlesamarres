import React from "react"
import { View, Button } from "react-native"
import { useTranslation } from "@/modules/context/TranslationContext"

const LanguageSwitcher: React.FC = () => {
     const { setLocale } = useTranslation()

     return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 20 }}>
               <Button title="Français" onPress={() => setLocale("fr")} />
               <Button title="English" onPress={() => setLocale("en")} />
          </View>
     )
}

export default LanguageSwitcher
