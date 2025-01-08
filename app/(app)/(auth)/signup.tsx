import React, { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { ActivityIndicator, Button, Text, TextInput, useTheme } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "@/modules/context/AuthProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useSignup } from "@/modules/hooks/auth/useSignup"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { UserRegistrationSchema } from "@/modules/domain/auth/schemas/UserRegistrationSchema"

export default function Signup() {
     const [userInfo, setUserInfo] = useState({
          lastname: "Escalona",
          firstname: "Charly",
          username: "cyrlah",
          email: "charly.escalona1@gmail.com",
          password: "testtesttesttest",
          confirmPassword: "testtesttesttest",
     })

     const { mutate: signUp, isPending, error } = useSignup()

     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const theme = useTheme()

     const {
          control,
          handleSubmit,
          trigger,
          setValue,
          resetField,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(UserRegistrationSchema),
          defaultValues: {
               lastname: "Escalona",
               firstname: "Charly",
               username: "cyrlah",
               email: "charly.escalona1@gmail.com",
               password: "testtesttesttest",
               confirmPassword: "testtesttesttest",
          },
     })

     if (isPending) {
          return (
               <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     const handleError = (error: any) => {
          console.log(error)
     }

     const handleSignup = async (data: any) => {
          try {
               signUp(data)
          } catch (error: any) {
               console.log(error)
          }
     }

     return (
          <View style={styles.container}>
               <ScrollView contentContainerStyle={styles.containerScrollView}>
                    <View style={styles.form}>
                         <Text variant="titleLarge">{t("register_title")}</Text>
                         <Text variant="titleMedium">{t("register_subtitle")}</Text>

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("lastname_placeholder")} label={t("lastname_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="lastname" />
                         {errors.lastname && <Text>{errors.lastname.message}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("firstname_placeholder")} label={t("firstname_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="firstname" />
                         {errors.firstname && <Text>{errors.firstname.message}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("username_placeholder")} label={t("username_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="username" />
                         {errors.username && <Text>{errors.username.message}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("email_placeholder")} label={t("email_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="email" />
                         {errors.email && <Text>{errors.email.message}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("password_placeholder")} label={t("password_label")} value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry />} name="password" />
                         {errors.password && <Text>{errors.password.message}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("confirm_password_placeholder")} label={t("confirm_password_label")} value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry />} name="confirmPassword" />
                         {errors.confirmPassword && <Text>{errors.confirmPassword.message}</Text>}

                         <Button icon="login" mode="contained" style={styles.login} onPress={handleSubmit(handleSignup, handleError)}>
                              {t("register_submit")}
                         </Button>
                    </View>
                    <View style={styles.buttons}>
                         <Text variant="titleLarge" style={styles.noAccount}>
                              {t("register_already_account")}
                         </Text>
                         <Button style={styles.button} mode="outlined" onPress={() => router.replace("/(app)/(auth)/signin")}>
                              {t("register_login_btn")}
                         </Button>
                    </View>
               </ScrollView>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          height: "100%",
          justifyContent: "center",
          width: "100%",
     },
     containerScrollView: {
          paddingVertical: 80,
          justifyContent: "center",
          alignItems: "center",
     },
     form: {
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
     },
     login: {
          marginTop: 20,
     },
     input: {
          width: "90%",
          marginVertical: 10,
     },
     buttons: {
          width: "80%",
          justifyContent: "space-between",
          height: 100,
     },
     button: {
          marginTop: 30,
     },
     noAccount: {
          marginTop: 20,
          textAlign: "center",
     },
     loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
})
