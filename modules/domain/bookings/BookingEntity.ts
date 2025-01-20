export default class BookingEntity {
     constructor(
          public readonly offerId: string,
          public readonly userId: string,
          public readonly startDate: string,
          public readonly endDate: string,
          public readonly status: string
     ) {
          if (!offerId || !userId || !startDate || !endDate || !status) {
               throw new Error("Invalid booking data")
          }
     }
}
