module.exports = {
     preset: "react-native",
     transform: {
          "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
     },
     setupFiles: ["dotenv/config", "<rootDir>/modules/tests/config/supabaseClientTest.ts"],
     setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
     moduleNameMapper: {
          "^@/(.*)$": "<rootDir>/$1",
          "/modules/lib/supabaseClient": "<rootDir>/modules/tests/config/supabaseClientTest.ts",
     },
     transformIgnorePatterns: ["node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*))"],
     testEnvironment: "jsdom",
     globalSetup: "<rootDir>/dotenv/dotenv-test.js",
}
