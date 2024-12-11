interface Boat {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          id: string
          url: string
          boatId: string | undefined
          isDefault: boolean
          caption: string
          contentType: string | undefined
          base64: string | undefined
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined
     }[]
}
