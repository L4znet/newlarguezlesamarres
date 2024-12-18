import { z } from "zod"

export const BoatSchema = z
     .object({
          profileId: z.string().uuid(),
          id: z.string().uuid().optional(),
          boatName: z.string().min(5, "Boat name must be at least 5 characters long"),
          boatDescription: z.string().min(10, "Boat description must be at least 10 characters long"),
          boatCapacity: z.string(),
          boatType: z.number(),
     })
     .transform((data) => ({
          profile_id: data.profileId,
          id: data.id,
          boat_name: data.boatName,
          boat_description: data.boatDescription,
          boat_capacity: data.boatCapacity,
          boat_type: data.boatType,
     }))

export type Boat = z.infer<typeof BoatSchema>
