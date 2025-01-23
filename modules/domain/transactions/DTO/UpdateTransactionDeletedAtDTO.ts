export class UpdateTransactionDeletedAtDTO {
     public readonly offerDeletedAt: Date

     constructor(offerDeletedAt: Date) {
          this.offerDeletedAt = offerDeletedAt
     }

     static toRawData(dto: UpdateTransactionDeletedAtDTO): any {
          return {
               offer_deleted_at: dto.offerDeletedAt,
          }
     }
}
