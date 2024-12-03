import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { updateProfileUseCase } from "@/modules/application/profile/updateProfileUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getProfileUseCase } from "@/modules/application/profile/getProfileUseCase"
import { router } from "expo-router"

interface ProfileContextProps {
     profile: Profile | null
     getProfile: () => Promise<void>
     updateProfile: (firstname: string, lastname: string, username: string, email: string | undefined) => Promise<void>
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
     const [profile, setProfile] = useState<Profile | null>(null)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const getProfile = async () => {
          try {
               const fetchedProfile = await getProfileUseCase()
               setProfile(fetchedProfile)
          } catch (error) {
               console.error("Erreur lors de la récupération du profil:", error)
          }
     }

     const updateProfile = async (firstname: string, lastname: string, username: string, email: string) => {
          try {
               const user = await updateProfileUseCase({ firstname, lastname, username, email }, showTranslatedFlashMessage)
               if (user) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User profile updated" })
                    setProfile(user)
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour du profil:", error)
          }
     }

     useEffect(() => {
          getProfile()
     }, [])

     return <ProfileContext.Provider value={{ profile, getProfile, updateProfile }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
     const context = useContext(ProfileContext)
     if (!context) {
          throw new Error("useProfile doit être utilisé dans un ProfileProvider")
     }
     return context
}
