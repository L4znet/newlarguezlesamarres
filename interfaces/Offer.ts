export interface Offer {
     boatId: string
     profileId?: string | null
     title: string
     description: string
     price: string
     isAvailable: boolean
     equipments: Equipment[]
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     rentalPeriod: {
          start: string
          end: string
     }
     location: Location
     deletedAt?: Date | null
     id?: string
}

interface BoatImage {
     id: string
     url: string
     caption: string | null
     contentType: string
     dimensions: { width: number; height: number }
     size: number
     mimeType: string
     fileName: string
}
export interface Equipment {
     equipmentName: string
     equipmentQuantity: string
}

export interface RentalPeriod {
     start: string
     end: string
}

export interface Location {
     city: string
     country: string
     zipcode: string
     address: string
}
