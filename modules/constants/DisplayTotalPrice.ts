export const displayTotalPrice = (
     price: string,
     rentalPeriod: {
          start: string
          end: string
     }
): {
     amountForStripe: number
     unitAmount: number
     totalAmount: number
} => {
     let amountForStripe = 0

     const days = getHowManyDays(rentalPeriod.start, rentalPeriod.end)

     const totalAmount = days * parseInt(price)
     amountForStripe = convertAmountForStripe(totalAmount)

     return {
          amountForStripe: amountForStripe,
          unitAmount: parseInt(price),
          totalAmount: totalAmount,
     }
}
const convertAmountForStripe = (amount: number) => amount * 100

export const getHowManyDays = (start: string, end: string) => {
     const startDate = new Date(start)
     const endDate = new Date(end)
     const diffTime = Math.abs(endDate.getTime() - startDate.getTime())

     return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
