import { z } from "zod"

export const OfferSchema = z
     .object({
          title: z.string().nonempty("zod_rule_title_required").min(10, "zod_rule_title_min_length").max(100, "zod_rule_title_max_length"),
          description: z.string().nonempty("zod_rule_description_required").min(10, "zod_rule_description_min_length").max(500, "zod_rule_description_max_length"),
          price: z.string().refine(
               (val) => {
                    const num = parseFloat(val)

                    return !isNaN(num) && num >= 5
               },
               {
                    message: "zod_rule_price_min_value",
               }
          ),
          isAvailable: z.boolean(),
          frequency: z.number(),
          equipments: z.array(
               z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    description: z.string(),
               })
          ),
          isSkipperAvailable: z.boolean(),
          isTeamAvailable: z.boolean(),
          rentalPeriod: z
               .object({
                    start: z.string().refine((val) => {
                         console.log("start", val)
                         return true
                    }),
                    end: z.string().refine((val) => {
                         console.log("end", val)
                         return true
                    }),
               })
               .refine((val) => {
                    console.log("object", val)
                    return true
               }),
          location: z.object({
               city: z.string(),
               country: z.string(),
               zipcode: z.string(),
               address: z.string(),
          }),
     })
     .transform((data) => ({
          title: data.title,
          description: data.description,
          price: data.price,
          is_available: data.isAvailable,
          frequency: data.frequency,
          equipments: data.equipments,
          is_skipper_available: data.isSkipperAvailable,
          is_team_available: data.isTeamAvailable,
          rental_period: data.rentalPeriod,
          location: data.location,
     }))

export type Offer = z.infer<typeof OfferSchema>
