export class BookingIdResponseDTO {
     public readonly id: string | null

     constructor(id: string | null) {
          this.id = id
     }

     static fromRawData(data: { id: string } | null): BookingIdResponseDTO {
          return new BookingIdResponseDTO(data ? data.id : null)
     }
}
