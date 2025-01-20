import React from "react"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { View } from "react-native"
import { Button, Text, useTheme } from "react-native-paper"

const LanguageSwitcher: React.FC = () => {
     const { setLocale, locale } = useTranslation()
     const t = getTranslator(locale)

     const theme = useTheme()
     return (
          <View style={{ flexDirection: "column", width: "80%", justifyContent: "space-between", height: 200 }}>
               <Button theme={theme} mode={"outlined"} onPress={() => setLocale("fr")}>
                    <Text>{t("language_switcher_french_btn")}</Text>
               </Button>
               <Button theme={theme} mode={"outlined"} onPress={() => setLocale("en")}>
                    <Text>{t("language_switcher_english_btn")}</Text>
               </Button>
               <Button theme={theme} mode={"outlined"} onPress={() => setLocale("es")}>
                    <Text>{t("language_switcher_spanish_btn")}</Text>
               </Button>
          </View>
     )
}

export default LanguageSwitcher
