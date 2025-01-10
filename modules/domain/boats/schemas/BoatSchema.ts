import { z } from "zod"

export const BoatSchema = z
     .object({
          boatName: z.string().nonempty("zod_rule_boat_name_no_empty").min(3, "zod_rule_boat_name_min_3"),
          boatDescription: z.string().nonempty("zod_rule_boat_description_no_empty").min(10, "zod_rule_boat_description_min_10"),
          boatCapacity: z.string().refine(
               (val) => {
                    const num = parseFloat(val)

                    return !isNaN(num) && num >= 1
               },
               {
                    message: "zod_rule_boat_capacity_min_value",
               }
          ),
          boatImages: z
               .array(
                    z.object({
                         boatId: z.string().uuid().optional(),
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
               )
               .refine(
                    (val) => {
                         return val.length > 0
                    },
                    {
                         message: "zod_rule_boat_images_min_length",
                    }
               ),
     })
     .transform((data) => ({
          boat_name: data.boatName,
          boat_description: data.boatDescription,
          boat_capacity: data.boatCapacity,
          boat_images: data.boatImages,
     }))

export type Boat = z.infer<typeof BoatSchema>
