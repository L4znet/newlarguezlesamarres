export default class BoatEntity {
     constructor(
          public readonly profile_id: string,
          public readonly boatName: string,
          public readonly boatDescription: string,
          public readonly boatCapacity: string,
          public readonly boatType: number,
          public readonly boatId: string | undefined = undefined,
          public readonly boatImages: {
               id: string
               url: string
               caption: string
               contentType: string
               base64: string | null
               dimensions: { width: number; height: number }
               size: number
               mimeType: string
               fileName: string
          }[] = []
     ) {}

     static fromSupabaseData(data: any): BoatEntity {
          return new BoatEntity(
               data.profile_id,
               data.boat_name,
               data.boat_description,
               data.boat_capacity,
               data.boat_type,
               data.id,
               data.boat_images
                    ? data.boat_images.map((img: any) => ({
                           id: img.id,
                           url: img.url,
                           caption: img.caption || "",
                           contentType: img.content_type || "unknown",
                           base64: img.base64 || null,
                           dimensions: img.dimensions || { width: 0, height: 0 },
                           size: img.size || 0,
                           mimeType: img.mime_type || "unknown",
                           fileName: img.file_name || "",
                      }))
                    : []
          )
     }
}
