export const SUPPORTED_TITLE_KEYS = ["flash_title_danger", "flash_title_success", "flash_title_warning", "flash_title_info", "flash_title_none", "flash_title_default"] as const

export type TitleTypeKeys = (typeof SUPPORTED_TITLE_KEYS)[number]
