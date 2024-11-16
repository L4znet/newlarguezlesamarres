import React, { createContext, useContext, useState, ReactNode } from "react"

type FlashMessage = {
     type: "error" | "success" | "info"
     message: string
}

type FlashMessageContextType = {
     flashMessage: FlashMessage | null
     setFlashMessage: (type: "error" | "success" | "info", message: string) => void
     clearFlashMessage: () => void
}

const FlashMessageContext = createContext<FlashMessageContextType | null>(null)

export const FlashMessageProvider = ({ children }: { children: ReactNode }) => {
     const [flashMessage, setFlashMessageState] = useState<FlashMessage | null>(null)

     const setFlashMessage = (type: "error" | "success" | "info", message: string) => {
          setFlashMessageState({ type, message })
          console.log("flashMessage", flashMessage)
          setTimeout(() => {
               clearFlashMessage()
          }, 3000)
     }

     const clearFlashMessage = () => {
          setFlashMessageState(null)
     }

     return <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage, clearFlashMessage }}>{children}</FlashMessageContext.Provider>
}

export const useFlashMessage = () => {
     const context = useContext(FlashMessageContext)
     if (!context) {
          throw new Error("useFlashMessage must be used within a FlashMessageProvider")
     }
     return context
}
