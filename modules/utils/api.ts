import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = ""
const SUPABASE_ANON_KEY = ""

// Crée et exporte une instance Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
