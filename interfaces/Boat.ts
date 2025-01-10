export interface Boat {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          id?: string | null
          url: string
          boatId?: string
          isDefault: boolean
          caption: string | null
          contentType: string
          base64: string
          dimensions: { width: number; height: number }
          size: number
          mimeType: string
          fileName: string | null
     }[]
}
