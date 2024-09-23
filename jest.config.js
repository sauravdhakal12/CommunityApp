/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1", // Adjust according to your structure
  },
  // transform: {
  //   "^.+.tsx?$": ["ts-jest", {}],
  // },
};
