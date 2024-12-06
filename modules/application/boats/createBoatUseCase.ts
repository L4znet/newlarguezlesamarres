// Use case for adding a boat
import { supabase } from "@/modules/utils/api"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import BoatRepository from "@/modules/domain/boats/BoatRepository"
import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"

export const createBoatUseCase = async ({ name, description, price, location, capacity, type, images }) => {
     try {
          const uploadedImageUrls = []
          for (const image of images) {
          }

          const newBoat = BoatRepositorySupabase.createBoat({
               name,
               description,
               price,
               location,
               capacity,
               type,
               images: uploadedImageUrls,
          })

          return newBoat
     } catch (error) {
          throw new Error(`Failed to add boat: ${error.message}`)
     }
}
