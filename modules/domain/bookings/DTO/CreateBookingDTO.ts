export class CreateBookingDTO {
     public readonly offerId: string
     public readonly userId: string
     public readonly startDate: string
     public readonly endDate: string
     public readonly status: string

     constructor({ offerId, userId, startDate, endDate, status }: { offerId: string; userId: string; startDate: string; endDate: string; status: string }) {
          this.offerId = offerId
          this.userId = userId
          this.startDate = startDate
          this.endDate = endDate
          this.status = status
     }

     static toRawData(dto: CreateBookingDTO): any {
          return {
               offer_id: dto.offerId,
               user_id: dto.userId,
               start_date: dto.startDate,
               end_date: dto.endDate,
               status: dto.status,
          }
     }
}
