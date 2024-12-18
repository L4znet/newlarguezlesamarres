export interface Offer {
     boatId: string
     profileId: string
     title: string
     description: string
     price: number
     isAvailable: boolean
     frequency: number
     equipments: Equipment[] | []
     isSkipperAvailable: boolean
     isTeamAvailable: boolean
     rentalPeriod: RentalPeriod
     location: Location
     deletedAt: Date | null
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
     zipCode: string
     address: string
}
