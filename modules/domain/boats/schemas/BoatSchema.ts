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
     })
     .transform((data) => () => {
          return {
               boatName: data.boatName,
               boatDescription: data.boatDescription,
               boatCapacity: data.boatCapacity,
          }
     })

export type Boat = z.infer<typeof BoatSchema>
