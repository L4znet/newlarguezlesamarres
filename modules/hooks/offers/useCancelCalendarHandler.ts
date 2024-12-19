import { useState } from "react"

export const useCancelCalendarHandler = (rawStartDate: Date | null, rawEndDate: Date | null, resetCalendar: () => void) => {
     const [isProcessing, setIsProcessing] = useState(false)

     const handleCancel = () => {
          if (isProcessing) return

          setIsProcessing(true)
          resetCalendar()
          setTimeout(() => {
               setIsProcessing(false)
          }, 200)
     }

     return { handleCancel, isProcessing }
}
