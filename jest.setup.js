const { seedDatabase, cleanupDatabase } = require("./seed/index")

beforeAll(async () => {
     await seedDatabase()
})

afterAll(async () => {
     await cleanupDatabase()
})

module.exports = {
     preset: "react-native",
     setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
     testMatch: ["<rootDir>/modules/tests/**/*.test.ts?(x)"],
}
