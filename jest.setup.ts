const { seedDatabase, cleanupDatabase } = require("./seed/index")

require("dotenv").config({ path: ".env" })

beforeAll(async () => {
     await seedDatabase()
     console.log("Loaded SUPABASE URL:", process.env.EXPO_PUBLIC_SUPABASE_URL)
})

afterAll(async () => {
     await cleanupDatabase()
})

module.exports = {
     preset: "ts-jest",
     testEnvironment: "node",
     moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
     moduleDirectories: ["node_modules", "src"],
     roots: ["<rootDir>/modules/tests"],
     transform: {
          "^.+\\.tsx?$": "ts-jest",
     },
     setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}
