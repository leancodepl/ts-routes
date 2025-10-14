const eslint = require("@eslint/js")
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended")
const { defineConfig } = require("eslint/config")
const tseslint = require("typescript-eslint")
const leancode = require("@leancodepl/eslint-config")

delete leancode.imports[0].rules["react/jsx-uses-react"]
delete leancode.imports[0].rules["react/jsx-uses-vars"]

module.exports = defineConfig(
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  { ignores: ["**/dist"] },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
    // Override or add rules here
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  ...leancode.base,
  ...leancode.imports,
)
