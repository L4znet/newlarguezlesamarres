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
               .optional(),
          isSkipperAvailable: z.boolean(),
          isTeamAvailable: z.boolean(),
          rentalPeriod: z
               .object({
                    start: z.string().nonempty("zod_rule_rental_period_required"),
                    end: z.string().nonempty("zod_rule_end_date_required"),
               })
               .refine(
                    (value) => {
                         return !(value.start === "" || value.end === "")
                    },
                    {
                         message: "zod_rule_rental_period_required",
                    }
               ),
          location: z
               .object({
                    city: z.string().nonempty("zod_rule_city_required"),
                    country: z.string().nonempty("zod_rule_country_required"),
                    address: z.string().nonempty("zod_rule_address_required"),
                    zipcode: z.string().nonempty("zod_rule_zipcode_required").length(5, { message: "zod_rule_zipcode_too_short" }).regex(/^\d+$/, { message: "zod_rule_zipcode_invalid" }),
               })
               .refine(
                    (value) => {
                         return !(value.city === "" || value.country === "" || value.address === "" || value.zipcode === "")
                    },
                    {
                         message: "zod_rule_location_required",
                    }
               ),
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
