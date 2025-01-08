import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const EmailUpdateSchema = z
     .object({
          email: z.string().nonempty(t("zod_rule_email_required")).email(t("validation_email_invalid")),
     })
     .transform((data) => ({
          email: data.email,
     }))

export type EmailUpdate = z.infer<typeof EmailUpdateSchema>
