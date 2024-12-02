import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, Button, Text, TextInput } from "react-native-paper"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import LanguageSwitcher from "@/modules/components/LanguageSwitcher"
import { updateProfileUseCase } from "@/modules/application/profile/updateProfileUseCase"
import { useProfile } from "@/modules/context/ProfileProvider"

export default function editProfile() {
     const { signOut } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { user } = useAuth()
     const { updateProfile } = useProfile()

     const [userData, setUserData] = useState({
          lastname: user?.user.user.user_metadata.lastname,
          firstname: user?.user.user.user_metadata.firstname,
          username: user?.user.user.user_metadata.username,
     })

     console.log("userid", user?.user.user.user_metadata)

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Avatar.Image size={150} source={require("@/assets/images/avatar.jpeg")} />
                    <TextInput style={styles.input} placeholder={t("lastname_placeholder")} label={t("lastname_label")} value={userData.lastname} onChangeText={(lastname) => setUserData({ ...userData, lastname })} />
                    <TextInput style={styles.input} placeholder={t("firstname_placeholder")} label={t("firstname_label")} value={userData.firstname} onChangeText={(firstname) => setUserData({ ...userData, firstname })} />
                    <TextInput style={styles.input} placeholder={t("username_placeholder")} label={t("username_label")} value={userData.username} onChangeText={(username) => setUserData({ ...userData, username })} />
               </View>
               <Button icon="pencil" mode="contained" onPress={async () => await updateProfile(userData.firstname, userData.lastname, userData.username)}>
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
