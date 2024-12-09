import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, TextInput, Button } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import { useProfile } from "@/modules/context/ProfileProvider"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export default function editProfile() {
     const { signOut } = useAuth()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { user } = useAuth()
     const { updateProfile, updateAvatar, profile } = useProfile()
     const { showTranslatedFlashMessage } = useFlashMessage()

     const [userData, setUserData] = useState({
          lastname: profile?.lastname || "",
          firstname: profile?.firstname || "",
          username: profile?.username || "",
          avatar: profile?.avatar || "",
     })

     const handleAvatarChange = async () => {
          try {
               // TODO ajouter l'avatar dans un bucket avec photo par défaut !!!!
               const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
               })

               if (!result.canceled) {
                    const avatar = result.assets[0].uri

                    setUserData({ ...userData, avatar })
               }
          } catch (error) {
               console.error("Erreur lors de la sélection de l'image:", error)
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_danger",
                    description: "Error while updating avatar",
               })
          }
     }

     const updateUserProfile = async (firstname: string, lastname: string, username: string, avatar: string) => {
          await updateProfile(firstname, lastname, username)
          await updateAvatar(avatar)
     }

     return (
          <View style={styles.container}>
               <View style={styles.form}>
                    <Avatar.Image size={150} source={userData.avatar ? { uri: userData.avatar } : require("@/assets/images/avatars/default-avatar.png")} />
                    <Button mode="text" onPress={handleAvatarChange}>
                         Change Avatar
                    </Button>
                    <TextInput style={styles.input} placeholder={t("lastname_placeholder")} label={t("lastname_label")} value={userData.lastname} onChangeText={(lastname) => setUserData({ ...userData, lastname })} />
                    <TextInput style={styles.input} placeholder={t("firstname_placeholder")} label={t("firstname_label")} value={userData.firstname} onChangeText={(firstname) => setUserData({ ...userData, firstname })} />
                    <TextInput style={styles.input} placeholder={t("username_placeholder")} label={t("username_label")} value={userData.username} onChangeText={(username) => setUserData({ ...userData, username })} />
               </View>
               <Button icon="pencil" mode="contained" onPress={async () => await updateUserProfile(userData.firstname, userData.lastname, userData.username, userData.avatar)}>
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
