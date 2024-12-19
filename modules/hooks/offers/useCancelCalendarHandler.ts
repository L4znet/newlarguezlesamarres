import { useState } from "react"

export const useCancelCalendarHandler = (rawStartDate: Date | null, rawEndDate: Date | null, resetCalendar: () => void) => {
     const [isProcessing, setIsProcessing] = useState(false)

     const handleCancel = () => {
          if (isProcessing) return

          setIsProcessing(true)
          console.log("JE SUIS LAAAA 2")
          resetCalendar()
          setTimeout(() => {
               setIsProcessing(false)
          }, 200)
     }

     return { handleCancel, isProcessing }
}
