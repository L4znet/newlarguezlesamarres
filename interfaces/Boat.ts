interface Boat {
     boatName: string
     boatDescription: string
     boatCapacity: string
     boatType: number
     boatImages: {
          url: string
          caption: string | undefined | null
          isDefault: boolean
          boatId: string | undefined
          id: string
     }[]
}
