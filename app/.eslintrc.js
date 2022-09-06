module.exports = {
  extends: ["plugin:prettier/recommended"],
  globals: {
    JSX: true,
    React: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "18.2.0",
    },
  },
  rules: {
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended", "plugin:jsdoc/recommended", "plugin:prettier/recommended"],
      rules: {
        "jsdoc/require-jsdoc": ["warn", { enableFixer: false }],
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        // TODO: Get rid of the below rules.
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
      },
    },
    {
      files: ["*.tsx"],
      excludedFiles: ["*.test.tsx", "*.test.ts"],
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jsdoc/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "jsdoc/require-jsdoc": ["warn", { enableFixer: false }],
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        // TODO: Get rid of the below rules.
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
      },
    },
    {
      files: ["*.test.tsx", "*.test.ts"],
      plugins: ["@typescript-eslint", "jest"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jsdoc/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:jsx-a11y/recommended",
        "plugin:jest/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "jsdoc/require-jsdoc": ["warn", { enableFixer: false }],
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        // TODO: Get rid of the below rules.
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/ban-types": "warn",
        "jest/no-standalone-expect": "warn",
        "jest/no-conditional-expect": "warn",
        "jest/valid-expect": "warn",
        "jest/no-identical-title": "warn",
      },
    },
  ],
};
