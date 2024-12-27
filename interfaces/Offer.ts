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
     rentalPeriod: RentalPeriod
     location: Location
     deletedAt?: Date | null
     id?: string
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
