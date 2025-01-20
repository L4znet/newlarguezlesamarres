export class GetBookingStatusDTO {
     public readonly status: string
     public readonly offerId: string
     public readonly userId: string

     constructor(status: string, offer_id: string, user_id: string) {
          this.status = status
          this.offerId = offer_id
          this.userId = user_id
     }

     static fromRawData(data: any): GetBookingStatusDTO {
          return new GetBookingStatusDTO(data.status, data.offer_id, data.user_id)
     }

     public hasUserReserved(currentUserId: string): boolean {
          return this.userId === currentUserId && this.status !== "canceled"
     }

     public isFullyReserved(): boolean {
          return this.status === "confirmed"
     }

     public canBeReservedByUser(currentUserId: string): boolean {
          if (this.isFullyReserved()) {
               return false
          }

          if (this.hasUserReserved(currentUserId)) {
               return false
          }

          return true
     }
}
