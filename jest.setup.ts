import path from "path"

import dotenv from "dotenv"

const process = dotenv.config({ path: path.resolve(__dirname, "./modules/tests/config/.env") })

if (!process.parsed?.EXPO_PUBLIC_SUPABASE_URL || !process.parsed.EXPO_PUBLIC_SUPABASE_URL) {
     throw new Error("Les variables d'environnement ne sont pas chargées correctement !")
}

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"))

jest.mock("expo-router", () => ({
     useRouter: jest.fn(() => ({
          push: jest.fn(),
          replace: jest.fn(),
          back: jest.fn(),
     })),
}))
