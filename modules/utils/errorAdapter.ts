import { ZodError } from "zod"
import { ValidationError } from "@/interfaces/ValidationError"
import { SupabaseAdapter } from "@/adapters/SupabaseAdapter"
import { ZodAdapter } from "@/adapters/ZodAdapter"

export const errorAdapter = (error: any): { path: any[]; code: string; context: {}; message: string }[] => {
     if (error instanceof ZodError) {
          return ZodAdapter(error)
     }

     if (error.code) {
          return SupabaseAdapter(error)
     }

     return [
          {
               code: "unknown_error",
               path: [],
               message: "An unknown error occurred.",
               context: {}, // Fallback à un objet vide
          },
     ]
}
