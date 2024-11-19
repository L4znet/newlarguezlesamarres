export const SUPPORTED_LOCALES = ["en", "fr"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]
