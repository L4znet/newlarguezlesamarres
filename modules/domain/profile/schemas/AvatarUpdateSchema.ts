import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const AvatarUpdateSchema = z
     .object({
          avatar_url: z
               .string()
               .min(1, t("validation_firstname_required"))
               .transform((val) => val.trim()),
     })
     .transform((data) => ({
          avatar_url: data.avatar_url,
     }))

export type AvatarUpdate = z.infer<typeof AvatarUpdateSchema>
