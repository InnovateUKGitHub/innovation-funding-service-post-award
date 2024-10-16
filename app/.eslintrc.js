module.exports = {
  extends: ["plugin:prettier/recommended", "plugin:storybook/recommended"],
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
  ignorePatterns: ["*/__generated__/**/*"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended", "plugin:jsdoc/recommended", "plugin:prettier/recommended"],
      rules: {
        "jsdoc/require-jsdoc": [
          "warn",
          {
            enableFixer: false,
          },
        ],
        "jsdoc/require-param": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/tag-lines": "off",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/ban-ts-comment": "warn",
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
        "jsdoc/require-jsdoc": [
          "warn",
          {
            enableFixer: false,
          },
        ],
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/tag-lines": "off",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/ban-ts-comment": "warn",
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
        "jsdoc/require-jsdoc": [
          "warn",
          {
            enableFixer: false,
          },
        ],
        "jsdoc/require-param": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/require-returns": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "jest/no-standalone-expect": [
          "warn",
          {
            additionalTestBlockFunctions: ["testCases"],
          },
        ],
        "jest/no-conditional-expect": "warn",
        "jest/valid-expect": "warn",
        "jest/no-identical-title": "warn",
      },
    },
  ],
};
