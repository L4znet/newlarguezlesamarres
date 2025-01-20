import { ValidationErrorCode } from "@/modules/constants/ValidationErrorTypes"

export interface ValidationError {
     code: ValidationErrorCode
     path: string[]
     message: string
     context: Record<string, any>
}
