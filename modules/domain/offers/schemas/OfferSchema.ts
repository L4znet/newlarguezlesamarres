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
          equipments: z
               .array(
                    z.object({
                         equipmentName: z.string(),
                         equipmentQuantity: z.string(),
                    })
               )
               .optional()
               .superRefine((value, ctx) => {
                    value?.map((equipment, index) => {
                         if (value?.length > 0) {
                              if (equipment.equipmentName === "") {
                                   ctx.addIssue({
                                        code: z.ZodIssueCode.custom,
                                        message: "Equipment name cannot be empty",
                                        path: ["equipmentName"],
                                   })
                              }

                              if (equipment.equipmentQuantity === "") {
                                   ctx.addIssue({
                                        code: z.ZodIssueCode.custom,
                                        message: "Equipment quantity cannot be empty",
                                        path: ["equipmentQuantity"],
                                   })
                              }
                         }
                    })
               }),

          isSkipperAvailable: z.boolean(),
          isTeamAvailable: z.boolean(),
          rentalPeriod: z
               .object({
                    start: z.undefined().or(z.string()),
                    end: z.undefined().or(z.string()),
               })
               .superRefine((value, ctx) => {
                    // check if start date is before actual date

                    if (value.start && new Date(value.start) < new Date()) {
                         ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: "zod_rule_rental_period_start_date_before",
                         })
                    }

                    if (!value.start && !value.end) {
                         ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: "zod_rule_rental_period_required",
                         })
                    } else if (!value.start) {
                         ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: "zod_rule_rental_period_start_required",
                         })
                    } else if (!value.end) {
                         ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: "zod_rule_rental_period_end_required",
                         })
                    }
               }),
          location: z
               .object({
                    city: z.string(),
                    country: z.string(),
                    address: z.string(),
                    zipcode: z.string(),
               })
               .superRefine((value) => {
                    console.log("Location", value)

                    return value.city !== "" && value.country !== "" && value.address !== "" && value.zipcode !== ""
               }),
          selectedBoatId: z.string().refine(
               (val) => {
                    return !(val === "")
               },
               { message: "zod_rule_boat_required" }
          ),
     })
     .transform((data) => ({
          title: data.title,
          description: data.description,
          price: data.price,
          isAvailable: data.isAvailable,
          equipments: data.equipments,
          isSkipperAvailable: data.isSkipperAvailable,
          isTeamAvailable: data.isTeamAvailable,
          rentalPeriod: data.rentalPeriod,
          location: data.location,
          boatId: data.selectedBoatId,
     }))

export type Offer = z.infer<typeof OfferSchema>
