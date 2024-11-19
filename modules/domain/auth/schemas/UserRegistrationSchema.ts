import { z } from "zod"
import { getTranslator } from "@/modules/context/TranslationContext"

const t = getTranslator()

export const UserRegistrationSchema = z
     .object({
          email: z
               .string()
               .email(t("validation_email_invalid"))
               .transform((email) => email.trim().toLowerCase()),
          password: z.string().min(8, t("validation_password_too_short")),
          confirmPassword: z.string().min(8, t("validation_password_too_short")),
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
     .refine((data) => data.password === data.confirmPassword, {
          message: t("validation_passwords_do_not_match"),
          path: ["confirmPassword"],
     })
     .transform((data) => ({
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
     }))

export type UserRegistration = z.infer<typeof UserRegistrationSchema>
