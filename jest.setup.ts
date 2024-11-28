import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, ".env.test") })

console.log("Loaded SUPABASE URL:", process.env.EXPO_PUBLIC_SUPABASE_TEST_URL)
