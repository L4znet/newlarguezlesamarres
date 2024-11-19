import en from "../translations/en.json"
import fr from "../translations/fr.json"
import { MessageType } from "react-native-flash-message"
import { TitleTypeKeys } from "@/constants/TitleTypeKeys"

const translations = {
     en,
     fr,
}

type Translations = typeof en

type MessageKeys = Exclude<keyof Translations, TitleTypeKeys>
type Locale = keyof typeof translations

export const mapMessage = (supabaseMessage: string, type: MessageType, locale: Locale = "fr"): { key: string; title: string; description: string } => {
     const translationFile = translations[locale]

     const titleKey: TitleTypeKeys = `flash_title_${type}`
     const title = translationFile[titleKey]

     const key = Object.keys(translationFile).find((k): k is MessageKeys => {
          const entry = translationFile[k as MessageKeys]
          return typeof entry === "object" && entry.supabase_message === supabaseMessage
     })

     if (!key) {
          return {
               key: "unknown_error",
               title,
               description: supabaseMessage,
          }
     }

     const entry = translationFile[key]

     const description = typeof entry === "object" ? entry.translation : supabaseMessage

     return { key, title, description }
}
