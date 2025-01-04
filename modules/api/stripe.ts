export const fetchPayment = async (
     accessToken: string,
     offerId: string,
     currency: string,
     amount: number,
     userId: string
): Promise<{
     clientSecret: string
     ephemeralKey: string
     customer: string
}> => {
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string

     const url = `${API_URL}/transactions`

     const response = await fetch(url, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
               offerId,
               amount,
               userId,
          }),
     })

     const data = await response.json()
     return {
          clientSecret: data.clientSecret,
          ephemeralKey: data.ephemeralKey,
          customer: data.customer,
     }
}
