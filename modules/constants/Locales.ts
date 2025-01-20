export const SUPPORTED_LOCALES = ["en", "fr", "es"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]
