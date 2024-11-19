import React, { createContext, useContext, ReactNode } from "react"
import FlashMessage, { showMessage, MessageType } from "react-native-flash-message"
import { useTranslation } from "@/modules/context/TranslationContext"
import { mapMessage } from "@/modules/utils/messageMapper"

type FlashMessageContextType = {
     showTranslatedFlashMessage: (type: MessageType, messageOrMessages: { title: string; description: string } | Array<{ title: string; description: string }>, locale?: string) => void
}

const FlashMessageContext = createContext<FlashMessageContextType | null>(null)

export const FlashMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const { locale } = useTranslation()

     const showTranslatedFlashMessage = (type: MessageType, messageOrMessages: { title: string; description: string } | Array<{ title: string; description: string }>) => {
          if (!Array.isArray(messageOrMessages)) {
               const { description } = messageOrMessages
               const translatedMessage = mapMessage(description, type, locale)

               showMessage({
                    message: translatedMessage.title,
                    description: translatedMessage.description,
                    type: type,
               })

               return
          }

          messageOrMessages.forEach(({ description, title }) => {
               let descriptionString = ""

               if (typeof description === "string") {
                    descriptionString = description
               } else if (typeof description === "object" && description !== null) {
                    try {
                         descriptionString = JSON.stringify(description)
                    } catch (error) {
                         descriptionString = "Une erreur inattendue est survenue."
                    }
               } else {
                    descriptionString = "Erreur inconnue."
               }

               const translatedMessage = mapMessage(descriptionString, type, locale)

               showMessage({
                    message: translatedMessage.title,
                    description: translatedMessage.description,
                    type: type,
               })
          })
     }

     return (
          <FlashMessageContext.Provider value={{ showTranslatedFlashMessage }}>
               {children}
               <FlashMessage position="top" />
          </FlashMessageContext.Provider>
     )
}

export const useFlashMessage = (): FlashMessageContextType => {
     const context = useContext(FlashMessageContext)
     if (!context) {
          throw new Error("useFlashMessage must be used within a FlashMessageProvider")
     }
     return context
}
