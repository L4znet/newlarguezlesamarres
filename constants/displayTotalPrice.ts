export const displayTotalPrice = (
     price: string,
     rentalPeriod: {
          start: string
          end: string
     },
     frequency: number
): {
     amountForStripe: number
     unitAmount: number
     totalAmount: number
} => {
     let amountForStripe = 0
     if (frequency === 0) {
          const startDate = new Date(rentalPeriod.start)
          const endDate = new Date(rentalPeriod.end)
          const diffHours = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
          const totalAmount = diffHours * parseInt(price)
          amountForStripe = convertAmountForStripe(totalAmount)
     } else {
          const days = getHowManyDays(rentalPeriod.start, rentalPeriod.end)
          const totalAmount = days * parseInt(price)
          amountForStripe = convertAmountForStripe(totalAmount)
     }

     return {
          amountForStripe: amountForStripe,
          unitAmount: parseInt(price),
          totalAmount: parseInt(price) * getHowManyDays(rentalPeriod.start, rentalPeriod.end),
     }
}
const convertAmountForStripe = (amount: number) => amount * 100

const getHowManyDays = (start: string, end: string) => {
     const startDate = new Date(start)
     const endDate = new Date(end)
     const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
