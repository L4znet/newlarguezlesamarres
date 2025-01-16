import BookingRepository from "@/modules/domain/bookings/BookingRepository"
import BookingEntity from "@/modules/domain/bookings/BookingEntity"
import supabase from "@/supabaseClient"
import OfferEntity from "@/modules/domain/offers/OfferEntity"
import { undefined } from "zod"
import { CreateBookingDTO } from "@/modules/domain/bookings/DTO/CreateBookingDTO"
import { BookingIdResponseDTO } from "@/modules/domain/bookings/DTO/BookingIdResponseDTO"
import { GetTenantsBookingsDTO } from "@/modules/domain/bookings/DTO/GetTenantBookingsDTO"
import { GetOwnerBookingsDTO } from "@/modules/domain/bookings/DTO/GetOwnerBookingsDTO"

class BookingRepositorySupabase implements BookingRepository {
     async getTenantBookings(userId: string): Promise<GetTenantsBookingsDTO[] | []> {
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
                          offer_rentals:rental_period,
                          ...boats!inner(
                            boat_name,
                            boat_images (id,caption,url)
                          )
                        )
                        `
               )
               .order("created_at", {
                    ascending: false,
               })
               .eq("user_id", userId)

          if (bookingError) {
               throw new Error(`Error getting bookings tenants: ${bookingError.message}`)
          }

          if (bookingData.length > 0) {
               return bookingData.map((booking) => GetTenantsBookingsDTO.fromRawData(booking))
          } else {
               return []
          }
     }

     async getOwnerBookings(userId: string): Promise<GetOwnerBookingsDTO[] | []> {
          try {
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
                          offer_rentals:rental_period,
                          offer_profile_id:profile_id,
                          ...boats!inner(
                            boat_name,
                            boat_type,
                            boat_images (id,caption,url)
                          )
                        )
                        `
                    )
                    .eq("offers.profile_id", userId)
                    .order("created_at", {
                         ascending: false,
                    })

               if (bookingError) {
                    throw new Error(`Error getting bookings tenants: ${bookingError.message}`)
               }

               if (bookingData.length > 0) {
                    return bookingData?.map((booking) => GetOwnerBookingsDTO.fromRawData(booking))
               } else {
                    return []
               }
          } catch (error) {
               throw new Error("Failed to fetch owner bookings")
          }
     }

     async updateBookingStatus(bookingId: string, status: string): Promise<BookingIdResponseDTO> {
          try {
               const {
                    data: offerIdResponse,
               }: {
                    data: { id: string } | null
               } = await supabase.from("bookings").update({ status }).eq("id", bookingId).select("id").single()

               return BookingIdResponseDTO.fromRawData(offerIdResponse)
          } catch (err) {
               console.error("Error updating booking status:", err)
               throw err
          }
     }

     async createBooking(booking: { offerId: string; userId: string; startDate: string; endDate: string; status: string }): Promise<BookingIdResponseDTO | undefined> {
          const createBookingDTO = new CreateBookingDTO(booking)
          const {
               data: bookingId,
               error,
          }: {
               data: { id: string } | null
               error: Error | null
          } = await supabase.from("bookings").insert(CreateBookingDTO.toRawData(createBookingDTO)).select("id").single()

          if (error) {
               console.error("Error creating booking:", error)
               throw new Error("Failed to create booking")
          }

          if (bookingId) {
               return BookingIdResponseDTO.fromRawData(bookingId)
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
