import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { updateProfileUseCase } from "@/modules/application/profile/updateProfileUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getProfileUseCase } from "@/modules/application/profile/getProfileUseCase"
import { listenToUserChangesUseCase } from "@/modules/application/profile/listenToUserChangesUseCase"
import { router } from "expo-router"
import { updateEmailUseCase } from "@/modules/application/profile/updateEmailUseCase"

interface ProfileContextProps {
     profile: Profile | null
     refreshProfile: () => Promise<void>
     updateProfile: (firstname: string, lastname: string, username: string) => Promise<void>
     updateEmail: (email: string) => Promise<void>
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
     const [profile, setProfile] = useState<Profile | null>(null)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const refreshProfile = async () => {
          try {
               const fetchedProfile = await getProfileUseCase()

               const profile = fetchedProfile.profile as Profile

               setProfile(profile)
          } catch (error) {
               console.error("Erreur lors de la récupération du profil:", error)
          }
     }

     const updateProfile = async (firstname: string, lastname: string, username: string) => {
          try {
               const updatedUser = await updateProfileUseCase({ firstname, lastname, username }, showTranslatedFlashMessage)

               if (updatedUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User profile updated" })
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour du profil:", error)
          }
     }

     const updateEmail = async (email: string) => {
          try {
               const updatedUser = await updateEmailUseCase({ email }, showTranslatedFlashMessage)

               console.log("updatedEmail", updatedUser)

               if (updatedUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User email updated" })
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour de l'email:", error)
          }
     }

     useEffect(() => {
          refreshProfile()

          const unsubscribe = listenToUserChangesUseCase((updatedUser) => {
               const profile = updatedUser.profile as Profile

               console.log("updatedUser", updatedUser.profile.username)
               setProfile(profile)
          })

          return () => {
               unsubscribe()
          }
     }, [])

     return <ProfileContext.Provider value={{ profile, refreshProfile, updateProfile, updateEmail }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
     const context = useContext(ProfileContext)
     if (!context) {
          throw new Error("useProfile doit être utilisé dans un ProfileProvider")
     }
     return context
}
