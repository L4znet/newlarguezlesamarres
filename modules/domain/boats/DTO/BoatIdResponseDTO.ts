export class BoatIdResponseDTO {
     public readonly id: string

     constructor(id: string) {
          this.id = id
     }

     static fromRawData(data: { id: string }): BoatIdResponseDTO {
          return new BoatIdResponseDTO(data.id)
     }
}
