export class TransactionIdResponseDTO {
     public readonly id: string

     constructor(id: string) {
          this.id = id
     }

     static fromRawData({ id }: { id: string }): TransactionIdResponseDTO {
          return new TransactionIdResponseDTO(id)
     }
}
