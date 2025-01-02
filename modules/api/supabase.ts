const API_URL = process.env.EXPO_PUBLIC_API_URL as string

export const verifyAndInsertTransaction = async ({ accessToken, paymentIntentId, offerId, userId }: { accessToken: string; paymentIntentId: string; offerId: string; userId: string }) => {
     const url = `${API_URL}/transactions`

     const response = await fetch(url, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
               paymentIntentId,
               offerId,
               userId,
          }),
     })

     return response.json()
}

export const createTransaction = async ({ accessToken, offerId, amount, userId }: { accessToken: string; offerId: string; amount: number; userId: string }) => {
     const url = `${API_URL}/transactions/create-payment-intent`

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

     return response.json()
}

export const insertReservation = async ({ accessToken, offerId, userId, startDate, endDate }: { accessToken: string; offerId: string; userId: string; startDate: string; endDate: string }) => {
     const url = `${API_URL}/reservations`

     const response = await fetch(url, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
               offerId,
               userId,
               startDate,
               endDate,
          }),
     })

     return response.json()
}
