import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const AvatarUpdateSchema = z
     .object({
          avatar: z
               .string()
               .min(1, t("validation_avatar_required"))
               .transform((val) => val.trim()),
     })
     .transform((data) => ({
          avatar: data.avatar,
     }))

export type AvatarUpdate = z.infer<typeof AvatarUpdateSchema>
