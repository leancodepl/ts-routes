module.exports = {
    printWidth: 120,
    useTabs: false,
    arrowParens: "avoid",
    trailingComma: "all",
    tabWidth: 4,
    jsxBracketSameLine: true,
    endOfLine: "lf",
    overrides: [
        {
            files: ["*.json", ".prettierrc", ".eslintrc", ".stylelintrc", ".yml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
    proseWrap: "always",
};
