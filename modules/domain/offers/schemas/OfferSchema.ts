import { z } from "zod"

export const OfferSchema = z
     .object({
          id: z.string().uuid(),
          profileId: z.string().uuid(),
          title: z.string().min(5, "Title must be at least 5 characters long"),
          description: z.string().min(10, "Description must be at least 10 characters long"),
          price: z.number(),
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
          rentalPeriod: z.array(
               z.object({
                    from: z.date(),
                    to: z.date(),
               })
          ),
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

export type Offer = z.infer<typeof OfferSchema>
