export default class BoatThumbnailEntity {
     constructor(
          public readonly id: string,
          public readonly boatId: string,
          public readonly url: string,
          public readonly isDefault: boolean,
          public readonly caption: string,
          public readonly contentType: string,
          public readonly base64: string,
          public readonly dimensions: { width: number; height: number }
     ) {}

     static fromSupabaseData(data: { id: string; boat_id: string; url: string; is_default: boolean; caption: string; content_type: string; base64: string; dimensions: { width: number; height: number } }): BoatEntity {
          return new BoatThumbnailEntity(data.id, data.boat_id, data.url, data.is_default, data.caption, data.content_type, data.base64, data.dimensions)
     }

     toSupabaseData(): {
          id: string
          boat_id: string
          url: string
          is_default: boolean
          caption: string
          content_type: string
          base64: string
          dimensions: { width: number; height: number }
     } {
          return {
               id: this.id,
               boat_id: this.boatId,
               url: this.url,
               is_default: this.isDefault,
               caption: this.caption,
               content_type: this.contentType,
               base64: this.base64,
               dimensions: this.dimensions,
          }
     }
}
