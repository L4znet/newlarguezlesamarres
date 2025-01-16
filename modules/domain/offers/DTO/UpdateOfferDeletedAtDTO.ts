export class UpdateOfferDeletedAtDTO {
     public readonly deletedAt: Date | null

     constructor(deletedAt: Date | null) {
          this.deletedAt = deletedAt
     }

     static toRawData(dto: UpdateOfferDeletedAtDTO): any {
          return {
               deleted_at: dto.deletedAt,
          }
     }
}
