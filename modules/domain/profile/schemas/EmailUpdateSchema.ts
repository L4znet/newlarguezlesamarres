import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const EmailUpdateSchema = z
     .object({
          email: z
               .string()
               .email(t("validation_email_invalid"))
               .transform((email) => email.trim().toLowerCase()),
     })
     .transform((data) => ({
          email: data.email,
     }))

export type EmailUpdate = z.infer<typeof EmailUpdateSchema>
