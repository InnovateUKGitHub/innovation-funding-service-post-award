module.exports = {
  extends: ["eslint:recommended", "plugin:cypress/recommended", "eslint:typescript"],
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
  plugins: ["cypress", "@typescript-eslint"],
  rules: {
    "cypress/no-unnecessary-waiting": "off",
  },
};
