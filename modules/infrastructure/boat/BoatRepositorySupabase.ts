import { createClient, PostgrestSingleResponse, AuthError, AuthChangeEvent, Session, UserResponse } from "@supabase/supabase-js"
import BoatRepository from "@/modules/domain/boats/BoatRepository"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

class BoatRepositorySupabase implements BoatRepository {
     async createBoat(boat) {
          try {
               const { data, error } = await supabase.from("boats").insert([{ ...boat }])
               if (error) {
                    throw new Error(`Error creating boat: ${error.message}`)
               }
               return data
          } catch (error) {
               throw new Error(`Failed to create boat: ${error.message}`)
          }
     }

     async updateBoat(boatId, boat) {
          try {
               const { data, error } = await supabase
                    .from("boats")
                    .update({ ...boat })
                    .eq("id", boatId)
               if (error) {
                    throw new Error(`Error updating boat: ${error.message}`)
               }
               return data
          } catch (error) {
               throw new Error(`Failed to update boat: ${error.message}`)
          }
     }

     async deleteBoat(boatId) {
          try {
               const { error } = await supabase.from("boats").delete().eq("id", boatId)
               if (error) {
                    throw new Error(`Error deleting boat: ${error.message}`)
               }
          } catch (error) {
               throw new Error(`Failed to delete boat: ${error.message}`)
          }
     }

     async getBoatById(boatId) {
          try {
               const { data, error } = await supabase.from("boats").select().eq("id", boatId)
               if (error) {
                    throw new Error(`Error getting boat: ${error.message}`)
               }
               return data
          } catch (error) {
               throw new Error(`Failed to get boat: ${error.message}`)
          }
     }
}

export default new BoatRepositorySupabase()
