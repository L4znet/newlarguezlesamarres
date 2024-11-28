module.exports = {
     preset: "ts-jest",
     testEnvironment: "node",
     transform: {
          "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
     },
     setupFiles: ["<rootDir>/jest.setup.ts"],
     moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
     moduleDirectories: ["node_modules", "src"],
     roots: ["<rootDir>/modules/tests"],
     moduleNameMapper: {
          "^@/(.*)$": "<rootDir>$1",
     },
     transformIgnorePatterns: ["node_modules/(?!(@supabase)/)"],
}
