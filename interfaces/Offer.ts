export interface Offer {
     boatId: string
     profileId: string
     title: string
     description?: string
     price: number
     isAvailable: boolean
     frequency: number
     equipments?: string[]
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     rentalPeriods?: RentalPeriod[]
     location: Location
     createdAt: string
     updatedAt: string
     deletedAt?: string
}

export interface RentalPeriod {
     from: string
     to: string
}

export interface Location {
     city: string
     country: string
     zipCode: string
     address: string
}
