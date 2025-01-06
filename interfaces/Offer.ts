import { RentalFrequency } from "@/constants/RentalFrequency"

export interface Offer {
     boatId: string
     profileId?: string | null
     title: string
     description: string
     price: string
     isAvailable: boolean
     frequency: number
     equipments: Equipment[] | []
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

interface Frequency {
     value: string
     list: {
          _id: RentalFrequency
          value: string
     }[]
     selectedList: {
          _id: RentalFrequency
          value: string
     }[]
     error: string
     id: RentalFrequency
}

export interface Equipment {
     name: string
     quantity: string
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
