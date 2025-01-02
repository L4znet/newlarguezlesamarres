import { z } from "zod"

export const BookingSchema = z
     .object({
          id: z.string().uuid(),
          profileId: z.string().uuid(),
          title: z.string().nonempty("zod_rule_title_required").min(10, "zod_rule_title_min_length").max(100, "zod_rule_title_max_length"),
          description: z.string().min(20, "zod_rule_description_min_length").max(500, "zod_rule_description_max_length"),
          price: z.number().min(0, "zod_rule_price_min_value"),
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
                    start: z.date({ required_error: "zod_rule_start_date_required" }),
                    end: z.date({ required_error: "zod_rule_end_date_required" }),
               })
               .refine(({ start, end }) => end > start, { message: "zod_rule_end_date_must_be_after_start_date" }),
          location: z.object({
               city: z.string(),
               country: z.string(),
               zipCode: z.string(),
               address: z.string(),
          }),
          deletedAt: z.date().optional(),
     })
     .transform((data) => ({
          id: data.id,
          profile_id: data.profileId,
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
          deleted_at: data.deletedAt,
     }))

export type Offer = z.infer<typeof BookingSchema>
