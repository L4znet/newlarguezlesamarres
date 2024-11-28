import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { getProfileUseCase } from "@/modules/application/auth/getProfileUseCase"

interface ProfileContextProps {
     profile: Profile | null
     getProfile: () => Promise<void>
     updateProfile: (firstname: string, lastname: string, username: string) => Promise<void>
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
     const [profile, setProfile] = useState<Profile | null>(null)

     const getProfile = async () => {
          try {
               const fetchedProfile = await getProfileUseCase()
               setProfile(fetchedProfile)
          } catch (error) {
               console.error("Erreur lors de la récupération du profil:", error)
          }
     }

     const updateProfile = async (firstname: string, lastname: string, username: string) => {
          try {
               await updateProfileUseCase(firstname, lastname, username)
               await getProfile()
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
