import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import supabase from "@/supabaseClient"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { undefined } from "zod"
import supabaseClient from "@/supabaseClient"

class BookingRepositorySupabase implements BookingRepository {
     async getTenantBookings(userId: string): Promise<BookingEntity[] | undefined> {
          const { data: bookingData, error: bookingError } = await supabase.from("bookings").select(`*, ...offers!inner(offer_title:title, offer_description:description, ...boats(boat_name,boat_images (id,caption,url)))`).eq("user_id", userId)

          if (bookingError) {
               throw new Error(`Error getting bookings tenants: ${bookingError.message}`)
          }

          if (bookingData) {
               return bookingData?.map((booking) => BookingEntity.fromSupabaseData(booking))
          }
     }

     async getOwnerBookings(userId: string): Promise<BookingEntity[] | undefined> {
          try {
               const { data, error } = await supabaseClient.from("bookings").select("*, offers(id, profile_id)").eq("offers.profile_id", userId).order("created_at", { ascending: false })

               if (error) {
                    console.error("Error fetching owner bookings:", error)
                    throw new Error("Failed to fetch owner bookings")
               }

               return data?.map((booking) => BookingEntity.fromSupabaseData(booking))
          } catch (error) {
               console.error("Error in getOwnerBookings:", error)
               throw new Error("Failed to fetch owner bookings")
          }
     }

     async cancelBooking(bookingId: string): Promise<void> {
          throw new Error("Method not implemented.")
     }

     async updateBookingStatus(bookingId: string, status: string): Promise<void> {
          throw new Error("Method not implemented.")
     }
}

export default new BookingRepositorySupabase()
