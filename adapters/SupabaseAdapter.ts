import { ValidationError } from "@/interfaces/ValidationError"

export const SupabaseAdapter = (error: any): ValidationError[] => {
     if (!error || !error.code) {
          return []
     }

     return [
          {
               code: error.code,
               path: [],
               message: error.message || "An unknown error occurred.",
               context: {
                    supabase_message: error.message,
               },
          },
     ]
}
