interface Boat {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          uri: string
          caption: string | undefined | null
          contentType: string | undefined
          base64: string | undefined | null
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined | null
     }[]
}
