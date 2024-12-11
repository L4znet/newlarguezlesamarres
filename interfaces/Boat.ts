interface Boat {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          id: string
          url: string
          boatId: string
          isDefault: boolean
          caption: string | null | undefined
          contentType: string | undefined
          base64: string | undefined
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined | null
     }[]
}
