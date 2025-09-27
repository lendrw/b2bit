import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
