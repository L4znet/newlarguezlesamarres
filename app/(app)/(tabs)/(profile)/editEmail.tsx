import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import LanguageSwitcher from "@/modules/components/LanguageSwitcher"
import { updateProfileUseCase } from "@/modules/application/profile/updateProfileUseCase"
import { useProfile } from "@/modules/context/ProfileProvider"

export default function editEmail() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { user } = useAuth()
     const { updateEmail } = useProfile()

     const [userData, setUserData] = useState({
          email: user?.user.user.user_metadata.email,
     })

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Text variant="titleLarge">{t("email_change_title")}</Text>
                    <Text variant="titleMedium">{t("email_change_subtitle")}</Text>
                    <Text variant="titleMedium">{t("email_change_description")}</Text>

                    <TextInput style={styles.input} placeholder={t("email_placeholder")} label={t("email_label")} value={userData.email} onChangeText={(email) => setUserData({ ...userData, email })} />
               </View>
               <Button icon="pencil" mode="contained" onPress={async () => await updateEmail(userData.email)}>
                    {t("edit_btn")}
               </Button>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
          width: "90%",
          textAlign: "center",
     },
     form: {
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
     },
     input: {
          width: "90%",
          marginVertical: 10,
     },
})
