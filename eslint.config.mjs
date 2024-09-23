import globals from "globals";
// import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  // { ignores: ["jest.config.js"] },
  // { files: ["./src/**/*.ts"] },
  // pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@/indent": ["error", 2],
      "@/linebreak-style": ["error", "unix"],
      "@/quotes": ["error", "double"],
      "@/semi": ["error", "always"],
      "@typescript-eslint/no-unused-vars": "off",
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-unused-vars": "off",
    }
    // rules: { "types": "error" }
  }//
);