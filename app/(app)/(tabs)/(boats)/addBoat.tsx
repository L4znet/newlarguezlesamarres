import React, { useRef, useState } from "react"
import { StyleSheet, View, Image, ScrollView, SafeAreaView } from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import Slideshow from "react-native-image-slider-show"
import { ImagePickerCanceledResult, ImagePickerSuccessResult } from "expo-image-picker"

export const selectValidator = (value: any) => {
     if (!value || value.length <= 0) {
          return "Please select a value."
     }

     return ""
}

export default function AddBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions()

     const [boat, setBoat] = useState<Boat>({
          name: "",
          description: "",
          price: 0,
          location: "",
          capacity: 0,
          type: 0,
          thumbnails: [],
     })

     const [gender, setGender] = useState({
          value: "",
          list: boatTypeOptions,
          selectedList: [],
          error: "",
     })

     const singleSelectRef = useRef(null)

     const theme = useTheme()

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          const thumbnails = [] as BoatThumbnail[]

          result.assets.map((asset) => {
               thumbnails.push({ url: asset.uri, caption: asset.fileName })
          })

          console.log(thumbnails)

          setBoat({ ...boat, thumbnails: thumbnails })
     }

     const handleThumbnailChange = async () => {
          try {
               let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                    orderedSelection: true,
                    selectionLimit: 5,
               })
               if (!result.canceled) {
                    handleMultiplePicture(result)
               }
          } catch (error) {
               console.error("Error while selecting image:", error)
          }
     }

     return (
          <View style={styles.container}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <Slideshow dataSource={boat.thumbnails} style={styles.slideShow} />
                         <Button mode="text" onPress={handleThumbnailChange}>
                              {t("change_thumbnail_btn")}
                         </Button>
                         <TextInput style={styles.input} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={boat.name} onChangeText={(name) => setBoat({ ...boat, name })} />
                         <TextInput style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={boat.description} onChangeText={(description) => setBoat({ ...boat, description })} />

                         <View style={styles.selector}>
                              <PaperSelect
                                   label={t("boat_type_placeholder")}
                                   value={gender.value}
                                   onSelection={(value: any) => {
                                        setGender({
                                             ...gender,
                                             value: value.text,
                                             selectedList: value.selectedList,
                                             error: "",
                                        })
                                   }}
                                   arrayList={[...gender.list]}
                                   selectedArrayList={gender.selectedList}
                                   errorText={gender.error}
                                   multiEnable={false}
                                   dialogTitleStyle={{ color: "white" }}
                                   dialogCloseButtonText={t("close_btn")}
                                   dialogDoneButtonText={t("done_btn")}
                              />
                         </View>

                         <Button mode="contained" style={styles.button}>
                              {t("add_boat_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     scrollViewBoats: {
          width: "90%",
          rowGap: 20,
          paddingTop: 20,
     },
     safeView: {
          width: "90%",
          rowGap: 20,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
     },
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
     },
     input: {
          width: "100%",
          marginVertical: 10,
     },
     textarea: {
          width: "100%",
          marginVertical: 10,
     },
     selector: {
          width: "100%",
          marginVertical: 10,
     },
     boatImage: {
          width: "100%",
          height: 250,
     },
})
