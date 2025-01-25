export class UpdateTransactionDeletedAtDTO {
     public readonly offerDeletedAt: Date
     public readonly offerId: null

     constructor(offerDeletedAt: Date, offerId:null) {
          this.offerDeletedAt = offerDeletedAt
          this.offerId = offerId
     }

     static toRawData(dto: UpdateTransactionDeletedAtDTO): any {
          return {
               offer_id:dto.offerId,
               offer_deleted_at: dto.offerDeletedAt,
          }
     }
}
