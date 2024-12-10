import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { updateProfileUseCase } from "@/modules/application/profile/updateProfileUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getProfileUseCase } from "@/modules/application/profile/getProfileUseCase"
import { listenToUserChangesUseCase } from "@/modules/application/profile/listenToUserChangesUseCase"
import { router } from "expo-router"
import { updateEmailUseCase } from "@/modules/application/profile/updateEmailUseCase"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"
import { subscribeToAuthChangesUseCase } from "@/modules/application/auth/subscribeToAuthChangeUseCase"
import { updateAvatarUseCase } from "@/modules/application/profile/updateAvatarUseCase"

interface ProfileContextProps {
     profile: Profile | null
     refreshProfile: () => Promise<void>
     updateProfile: (firstname: string, lastname: string, username: string) => Promise<void>
     updateEmail: (email: string) => Promise<void>
     updateAvatar: (avatar: string) => Promise<void>
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
     const [profile, setProfile] = useState<Profile | null>(null)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const checkIfUserIsConnected = async () => {
          const currentUser = await getCurrentUserUseCase()
          return currentUser !== null
     }

     const refreshProfile = async () => {
          try {
               const fetchedProfile = await getProfileUseCase()
               const profile = fetchedProfile as unknown as Profile
               setProfile(profile)
          } catch (error) {
               console.error("Erreur lors de la récupération du profil:", error)
          }
     }

     const updateProfile = async (firstname: string, lastname: string, username: string) => {
          try {
               const updatedUser = await updateProfileUseCase({ firstname, lastname, username }, showTranslatedFlashMessage)
               const user = updatedUser as unknown as Profile
               if (updatedUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User profile updated" })
                    setProfile(user)
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour du profil:", error)
          }
     }

     const updateEmail = async (email: string) => {
          try {
               const updatedUser = await updateEmailUseCase({ email }, showTranslatedFlashMessage)
               const user = updatedUser as unknown as Profile
               if (updatedUser) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User email updated" })
                    setProfile((prevProfile) => (prevProfile ? { ...prevProfile, email: user.email } : prevProfile))
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour de l'email:", error)
          }
     }

     const updateAvatar = async (avatar: string) => {
          try {
               const updateAvatar = await updateAvatarUseCase({ avatar }, showTranslatedFlashMessage)

               if (updateAvatar) {
                    showTranslatedFlashMessage("success", { title: "flash_title_success", description: "User avatar updated" })
                    setProfile((prevProfile) => (prevProfile ? { ...prevProfile, avatar_url: avatar } : prevProfile))
                    router.push("/(app)/(tabs)/(profile)")
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour de l'avatar:", error)
          }
     }

     useEffect(() => {
          const initializeProfile = async () => {
               const isConnected = await checkIfUserIsConnected()
               if (isConnected) {
                    await refreshProfile()
               }
          }

          initializeProfile()

          const unsubscribeAuth = subscribeToAuthChangesUseCase((user) => {
               if (user) {
                    refreshProfile()
               } else {
                    setProfile(null)
               }
          })

          const unsubscribeProfile = listenToUserChangesUseCase((updatedUser) => {
               const profile = updatedUser as unknown as Profile
               setProfile(profile)
          })

          return () => {
               unsubscribeAuth()
               unsubscribeProfile()
          }
     }, [])

     return <ProfileContext.Provider value={{ profile, refreshProfile, updateProfile, updateEmail, updateAvatar }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
     const context = useContext(ProfileContext)
     if (!context) {
          throw new Error("useProfile doit être utilisé dans un ProfileProvider")
     }
     return context
}
