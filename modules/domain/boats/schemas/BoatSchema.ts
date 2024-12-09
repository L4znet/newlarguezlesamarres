import { z } from "zod"

const BoatSchema = z
     .object({
          boatName: z.string().min(5, "Boat name must be at least 5 characters long"),
          boatDescription: z.string().min(10, "Boat description must be at least 10 characters long"),
          boatCapacity: z.string(),
          boatType: z.number(),
          boatImages: z.array(
               z.object({
                    uri: z.string(),
                    caption: z.string().optional(),
               })
          ),
     })
     .transform((data) => ({
          boat_name: data.boatName,
          boat_description: data.boatDescription,
          boat_capacity: data.boatCapacity,
          boat_type: data.boatType,
          boat_images: data.boatImages,
     }))

export type Boat = z.infer<typeof BoatSchema>
