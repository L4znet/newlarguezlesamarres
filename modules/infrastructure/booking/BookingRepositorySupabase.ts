import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import supabase from "@/supabaseClient"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { undefined } from "zod"
import supabaseClient from "@/supabaseClient"

class BookingRepositorySupabase implements BookingRepository {
     async getTenantBookings(userId: string): Promise<BookingEntity[] | undefined> {
          const { data: bookingData, error: bookingError } = await supabase
               .from("bookings")
               .select(
                    `
                        *,
                        ...profiles!inner(
                            profile_lastname:lastname,
                            profile_firstname:firstname,
                            profile_email:email,
                            profile_username:username
                       ),
                        ...offers!inner(
                         offer_id:id,
                          offer_title:title,
                          offer_description:description,
                          offer_price:price,
                          offer_frequency:frequency,
                          offer_rentals:rental_period,
                          ...boats!inner(
                            boat_name,
                            boat_images (id,caption,url)
                          )
                        )
                        `
               )
               .eq("user_id", userId)

          if (bookingError) {
               throw new Error(`Error getting bookings tenants: ${bookingError.message}`)
          }

          if (bookingData) {
               return bookingData?.map((booking) => BookingEntity.fromSupabaseData(booking))
          }
     }

     async getOwnerBookings(userId: string): Promise<BookingEntity[] | undefined> {
          try {
               const { data, error } = await supabase
                    .from("bookings")
                    .select(
                         `
                        *,
                        ...profiles!inner(
                            profile_lastname:lastname,
                            profile_firstname:firstname,
                            profile_email:email,
                            profile_username:username
                       ),
                        ...offers!inner(
                          offer_id:id,
                          offer_title:title,
                          offer_description:description,
                          offer_price:price,
                          offer_frequency:frequency,
                          offer_rentals:rental_period,
                          ...boats!inner(
                            boat_name,
                            boat_images (id,caption,url)
                          )
                        )
                        `
                    )
                    .eq("offers.profile_id", userId)
                    .order("created_at", {
                         ascending: false,
                    })

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

     async updateBookingStatus(bookingId: string, status: string): Promise<any> {
          try {
               const { data, error } = await supabaseClient.from("bookings").update({ status }).eq("id", bookingId)

               if (error) {
                    throw new Error(error.message)
               }

               return data
          } catch (err) {
               console.error("Error updating booking status:", err)
               throw err
          }
     }

     async createBooking(booking: { offerId: string; userId: string; startDate: string; endDate: string; status: string }): Promise<BookingEntity | undefined> {
          const { data: bookingData, error } = await supabase.from("bookings").insert(BookingEntity.toSupabaseData(booking)).single()

          if (error) {
               console.error("Error creating booking:", error)
               throw new Error("Failed to create booking")
          }

          if (bookingData) {
               return BookingEntity.fromSupabaseData(bookingData)
          }
     }

     async getBookingStatus(offerId: string, userId: string | null): Promise<{ offerReserved: boolean; userHasReserved: boolean }> {
          let query = supabase.from("bookings").select("status, offer_id, user_id").eq("offer_id", offerId)

          if (userId) {
               query = query.eq("user_id", userId)
          }

          const { data: bookings, error } = await query

          if (error) {
               console.error("Failed to fetch booking status:", error.message)
               throw new Error("Error fetching booking status")
          }

          const offerReserved = bookings?.length > 0
          const userHasReserved = bookings?.some((booking) => booking.status !== "cancelled")

          return { offerReserved, userHasReserved }
     }
}

export default new BookingRepositorySupabase()
