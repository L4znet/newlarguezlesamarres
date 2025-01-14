export class CreateBoatImageDTO {
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
               if (!url) console.log("url is missing")
               if (!caption) console.log("caption is missing")
               if (!content_type) console.log("content_type is missing")
               if (!base64) console.log("base64 is missing")
               if (!dimensions) console.log("dimensions is missing")
               if (!size) console.log("size is missing")
               if (!mime_type) console.log("mime_type is missing")
               if (!file_name) console.log("file_name is missing")
               if (!boat_id) console.log("boat_id is missing")

               console.log("Les champs sont : ", { url, is_default, caption, content_type, dimensions, size, mime_type, file_name, boat_id })
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

     static fromRawData({ url, is_default, caption, content_type, base64, dimensions, size, mime_type, file_name, boat_id }: { url: string; is_default: boolean; caption: string; content_type: string; base64: string; dimensions: { width: number; height: number }; size: string; mime_type: string; file_name: string; boat_id: string }): CreateBoatImageDTO {
          return new CreateBoatImageDTO({ url, is_default, caption, content_type, base64, dimensions, size, mime_type, file_name, boat_id })
     }

     static toRawData(data: CreateBoatImageDTO): {
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
