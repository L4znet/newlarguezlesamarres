import { ZodError, ZodIssue } from "zod"
import { ValidationError } from "@/interfaces/ValidationError"

export const ZodAdapter = (error: ZodError): ValidationError[] => {
     return error.errors.map((issue: ZodIssue) => ({
          code: issue.code as ValidationError["code"],
          path: issue.path.map(String),
          message: issue.message,
          context: {
               ...issue,
          },
     }))
}
