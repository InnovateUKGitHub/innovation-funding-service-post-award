module.exports = {
  extends: ["eslint:recommended", "plugin:cypress/recommended"],
  env: {
    browser: true,
    es2021: true,
    node: true,
    "cypress/globals": true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["cypress"],
  rules: {
    "cypress/no-unnecessary-waiting": "off",
  },
};
