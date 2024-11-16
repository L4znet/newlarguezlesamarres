import { z } from "zod"

export const UserRegistrationSchema = z
     .object({
          email: z.string().email("L'adresse email est invalide"),
          password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
          confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
          firstname: z.string().min(1, "Le prénom est requis"),
          lastname: z.string().min(1, "Le nom de famille est requis"),
          username: z.string().min(1, "Le nom d'utilisateur est requis"),
     })
     .refine((data) => data.password === data.confirmPassword, {
          message: "Les mots de passe ne correspondent pas",
          path: ["confirmPassword"],
     })

export type UserRegistration = z.infer<typeof UserRegistrationSchema>
