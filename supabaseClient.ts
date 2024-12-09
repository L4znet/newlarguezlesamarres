import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppState } from "react-native"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey, {
     auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
     },
})

AppState.addEventListener("change", async (state) => {
     console.log("AppState", state)
     if (state === "active") {
          await supabase.auth.startAutoRefresh()
     } else {
          await supabase.auth.stopAutoRefresh()
     }
})
export default supabase
