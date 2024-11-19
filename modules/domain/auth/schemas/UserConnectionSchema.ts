import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"
const t = getTranslator()
export const UserConnectionSchema = z.object({
     email: z
          .string()
          .email(t("validation_email_invalid"))
          .transform((email) => email.trim().toLowerCase()),
})

export type UserConnectionSchema = z.infer<typeof UserConnectionSchema>
