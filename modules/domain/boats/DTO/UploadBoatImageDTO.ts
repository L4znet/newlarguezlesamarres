export class UploadBoatImageDTO {
     public url: string
     public isDefault: boolean
     public caption: string
     public contentType: string
     public base64: string
     public dimensions: { width: number; height: number }
     public size: string
     public mimeType: string
     public fileName: string
     public boatId: string

     constructor({ url, is_default, caption, content_type, base64, dimensions, size, mime_type, file_name, boat_id }: { url: string; is_default: boolean; caption: string; content_type: string; base64: string; dimensions: { width: number; height: number }; size: string; mime_type: string; file_name: string; boat_id: string }) {
          if (!url || is_default === undefined || !caption || !content_type || !base64 || !dimensions || !size || !mime_type || !file_name || !boat_id) {
               throw new Error("Missing required fields for CreateBoatImageDTO.")
          }

          this.url = url
          this.isDefault = is_default
          this.caption = caption
          this.contentType = content_type
          this.base64 = base64
          this.dimensions = dimensions
          this.size = size
          this.mimeType = mime_type
          this.fileName = file_name
          this.boatId = boat_id
     }

     static fromRawData(data: { url: string; is_default: boolean; caption: string; content_type: string; base64: string; dimensions: { width: number; height: number }; size: string; mime_type: string; file_name: string; boat_id: string }): UploadBoatImageDTO {
          return new UploadBoatImageDTO(data)
     }

     static toRawData(data: UploadBoatImageDTO): {
          url: string
          is_default: boolean
          caption: string
          content_type: string
          base64: string
          dimensions: { width: number; height: number }
          size: string
          mime_type: string
          file_name: string
          boat_id: string
     } {
          return {
               url: data.url,
               is_default: data.isDefault,
               caption: data.caption,
               content_type: data.contentType,
               base64: data.base64,
               dimensions: data.dimensions,
               size: data.size,
               mime_type: data.mimeType,
               file_name: data.fileName,
               boat_id: data.boatId,
          }
     }
}
