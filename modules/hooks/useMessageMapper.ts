import { useTranslation } from "@/modules/context/TranslationContext"
import { mapMessage as mapMessagePure } from "@/modules/utils/messageMapper"

export const useMessageMapper = () => {
     const { t, locale } = useTranslation()

     const mapMessage = (message: string): string => {
          const key = mapMessagePure(message)
          return t(key as keyof typeof t)
     }

     return { mapMessage }
}
