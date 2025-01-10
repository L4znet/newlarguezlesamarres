type BoatImageRawData = {
     id: string
     url: string
     boat_id: string
     is_default: boolean
     caption: string
     content_type: string
     base64: string
     dimensions: { width: number; height: number }
     size: string
     mime_type: string
     file_name: string
}

export class BoatImageDTO {
     public id: string
     public url: string
     public boatId: string
     public isDefault: boolean
     public caption: string
     public contentType: string
     public base64: string
     public dimensions: { width: number; height: number }
     public size: string
     public mimeType: string
     public fileName: string

     constructor(data: BoatImageRawData) {
          this.id = data.id
          this.url = data.url
          this.boatId = data.boat_id
          this.isDefault = data.is_default
          this.caption = data.caption
          this.contentType = data.content_type
          this.base64 = data.base64
          this.dimensions = data.dimensions
          this.size = data.size
          this.mimeType = data.mime_type
          this.fileName = data.file_name
     }

     static fromRawData(data: BoatImageRawData): BoatImageDTO {
          return new BoatImageDTO(data)
     }

     static toRawData(data: BoatImageDTO): BoatImageRawData {
          return {
               id: data.id,
               url: data.url,
               boat_id: data.boatId,
               is_default: data.isDefault,
               caption: data.caption,
               content_type: data.contentType,
               base64: data.base64,
               dimensions: data.dimensions,
               size: data.size,
               mime_type: data.mimeType,
               file_name: data.fileName,
          }
     }
}
