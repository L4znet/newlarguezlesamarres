module.exports = {
     preset: "ts-jest",
     testEnvironment: "jsdom",
     transform: {
          "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
     },
     moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
     moduleDirectories: ["node_modules", "src"],
     roots: ["<rootDir>/modules/tests"],
     setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
     moduleNameMapper: {
          "^@/(.*)$": "<rootDir>$1",
     },
     transformIgnorePatterns: ["node_modules/(?!(@supabase)/)"],
}
