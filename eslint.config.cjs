const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const leancode = require("@leancodepl/eslint-config");
const { resolveFlatConfig } = require("@leancodepl/resolve-eslint-flat-config");
const typescriptEslint = require("typescript-eslint");
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");

delete leancode.imports[0].rules["react/jsx-uses-react"];
delete leancode.imports[0].rules["react/jsx-uses-vars"];

module.exports = defineConfig(
    eslintPluginPrettierRecommended,
    eslint.configs.recommended,
    tseslint.configs.recommended,
    { ignores: ["**/dist"] },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        // Override or add rules here
        rules: {},
    },
    ...leancode.base,
    ...leancode.imports,
);
