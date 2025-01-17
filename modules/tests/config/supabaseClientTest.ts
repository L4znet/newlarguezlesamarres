import { createClient, SupabaseClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppState } from "react-native"
import dotenv from "dotenv"
import path from "path"
const processEnv = dotenv.config({ path: path.resolve(__dirname, ".env") })

const supabaseUrl = processEnv?.parsed?.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseKey = processEnv?.parsed?.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

const supabaseClientTest = createClient(supabaseUrl, supabaseKey, {
     auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
     },
})

AppState.addEventListener("change", async (state) => {
     if (state === "active") {
          await supabaseClientTest.auth.startAutoRefresh()
     } else {
          await supabaseClientTest.auth.stopAutoRefresh()
     }
})
export default supabaseClientTest
