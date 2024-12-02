import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const ProfileUpdateSchema = z
     .object({
          email: z
               .string()
               .email(t("validation_email_invalid"))
               .transform((email) => email.trim().toLowerCase()),
          firstname: z
               .string()
               .min(1, t("validation_firstname_required"))
               .transform((val) => val.trim()),
          lastname: z
               .string()
               .min(1, t("validation_lastname_required"))
               .transform((val) => val.trim()),
          username: z
               .string()
               .min(1, t("validation_username_required"))
               .transform((val) => val.trim()),
     })
     .transform((data) => ({
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
     }))

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>
