export class OfferIdResponseDTO {
     public readonly id: string

     constructor(id: string) {
          this.id = id
     }

     static fromRawData({ id }: { id: string }): OfferIdResponseDTO {
          return new OfferIdResponseDTO(id)
     }
}
