import { z } from "zod"

export const BoatSchema = z
     .object({
          profileId: z.string().uuid(),
          id: z.string().uuid().optional(),
          boatName: z.string().min(5, "Boat name must be at least 5 characters long"),
          boatDescription: z.string().min(10, "Boat description must be at least 10 characters long"),
          boatCapacity: z.string(),
          boatImages: z.array(
               z.object({
                    boatId: z.string().uuid(),
                    id: z.string().uuid(),
                    isDefault: z.boolean(),
                    url: z.string().url(),
                    caption: z.string(),
                    contentType: z.string(),
                    base64: z.string(),
                    dimensions: z.object({ width: z.number(), height: z.number() }),
                    size: z.number(),
                    mimeType: z.string(),
                    fileName: z.string(),
               })
          ),
     })
     .transform((data) => ({
          profile_id: data.profileId,
          id: data.id,
          boat_name: data.boatName,
          boat_description: data.boatDescription,
          boat_capacity: data.boatCapacity,
     }))

export type Boat = z.infer<typeof BoatSchema>
