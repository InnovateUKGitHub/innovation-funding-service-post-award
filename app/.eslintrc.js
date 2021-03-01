module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    "jest/globals": true,
  },
  globals: {
    jsx: true,
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      // Note: this specifies a parser for ts/tsx files only
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    {
      files: ["*.tsx"],
      rules: {
        "no-undef": "warn",
        "react/react-in-jsx-scope": "off"
      },
    },
    {
      files: ["*.tests.tsx", "*.tests.ts"],
      rules: {
        "react/display-name": "off",
      },
    },
    {
      files: ["./src/ui/componentsGuide/*.tsx"],
      rules: {
        "@typescript-eslint/quotes": "off",
      },
    },
    {
      files: [
        "**/details.tests.tsx",
        "**/documentSingle.tests.tsx",
        "**/errorSummary.tests.tsx",
        "**/links.tests.tsx",
        "**/linksList.tests.tsx",
        "**/navigationArrows.tests.tsx",
        "**/navigationCard.tests.tsx",
        "**/partnersAndFinanceContacts.tests.tsx",
        "**/projectContact.tests.tsx",
        "**/summaryList.tests.tsx",
        "**/table.tests.tsx",
        "**/tableHelpers.ts",
        "**/validationMessage.tests.tsx",
        "**/claimDetailsLink.tests.tsx",
        "**/find-by-qa.ts",
        "**/tableHelpers.tests.tsx",
        "**/dateInput.tests.tsx",
        "**/dropdownList.tests.tsx",
        "**/fileUpload.tests.tsx",
        "**/numberInput.tests.tsx",
        "**/radioList.tests.tsx",
        "**/textAreaInput.tests.tsx",
        "**/textInput.tests.tsx",
        "**/breadcrumbs.tests.tsx",
        "**/footer.tests.tsx",
        "**/hashTabs.tests.tsx",
        "**/header.tests.tsx",
        "**/insetText.tests.tsx",
        "**/phaseBanner.tests.tsx",
        "**/section.tests.tsx",
        "**/sectionPanel.tests.tsx",
        "**/tabs.tests.tsx",
        "**/textHint.tests.tsx",
        "**/contactsTable.tests.tsx",
        "**/partnerName.tests.tsx",
        "**/date.tests.tsx",
        "**/markdown.tests.tsx",
        "**/messages.tests.tsx",
        "**/percentage.tests.tsx",
        "**/getQaRef.tsx",
      ],
      rules: {
        "no-restricted-imports": "off",
      },
    },
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // TODO: this needs to be addressed separately
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:sonarjs/recommended",
  ],
  plugins: [
    "eslint-plugin-import",
    "eslint-plugin-react",
    "eslint-plugin-jsdoc",
    "eslint-plugin-prefer-arrow",
    "@typescript-eslint/",
    "jsx-a11y",
    "jest",
    "eslint-plugin-sonarjs",
  ],
  rules: {
    "@typescript-eslint/ban-types": "off", // TODO: switch back to error
    "@typescript-eslint/explicit-module-boundary-types": "off", // TODO: switch back to error
    "@typescript-eslint/no-non-null-assertion": "off", // TODO: switch back to error
    "@typescript-eslint/naming-convention": "off", // TODO: switch back to error
    "sonarjs/no-duplicate-string": "off", // TODO: switch back to error
    "sonarjs/cognitive-complexity": "off", /// TODO: switch back to error
    "sonarjs/no-unused-collection": "off", // TODO: switch back to error
    "no-unused-vars": "off", // TODO: delete this (since it's already turned on in the recommended config for eslint)
    "id-blacklist": "off", // TODO: switch back to error "warn", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"
    "prefer-arrow/prefer-arrow-functions": "off", // TODO: switch back to error
    "react/prop-types": "warn", // TODO: maybe switch off
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array",
      },
    ],
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    // "@typescript-eslint/dot-notation": "error",
    "@typescript-eslint/explicit-member-accessibility": [
      "off",
      {
        accessibility: "explicit",
      },
    ],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-shadow": [
      "error",
      {
        hoist: "all",
      },
    ],
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-for-of": "off",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    // "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/quotes": [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/triple-slash-reference": [
      "error",
      {
        path: "always",
        types: "prefer-import",
        lib: "always",
      },
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/unified-signatures": "error",
    "sonarjs/max-switch-cases": "error",
    "sonarjs/no-collapsible-if": "error",
    "sonarjs/no-collection-size-mischeck": "error",
    "sonarjs/no-duplicated-branches": "error",
    "sonarjs/no-identical-conditions": "error",
    "sonarjs/no-identical-functions": "warn",
    "sonarjs/no-inverted-boolean-check": "error",
    "sonarjs/no-redundant-boolean": "error",
    "sonarjs/no-redundant-jump": "error",
    "sonarjs/no-same-line-conditional": "error",
    "sonarjs/no-small-switch": "error",
    "sonarjs/no-useless-catch": "error",
    "sonarjs/prefer-immediate-return": "error",
    "no-redeclare": "warn",
    // "max-lines-per-function": ["error", 20],
    "arrow-body-style": "off",
    "arrow-parens": ["off", "always"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": "off",
    complexity: "off",
    "constructor-super": "error",
    curly: ["error", "multi-line"],
    "eol-last": "error",
    eqeqeq: ["error", "smart"],
    "guard-for-in": "off",
    "id-match": "error",
    "import/order": "error",
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "error",
    "jsdoc/newline-after-description": "error",
    "max-classes-per-file": "off",
    "max-len": "off",
    "new-parens": "error",
    "no-bitwise": "off",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": "off",
    "no-debugger": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-fallthrough": "off",
    "no-invalid-this": "off",
    "no-multiple-empty-lines": "error",
    "no-new-wrappers": "error",
    "no-throw-literal": "error",
    "no-restricted-imports": ["error", "enzyme"],
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "error",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "prefer-const": "error",
    "quote-props": ["warn", "as-needed"],
    radix: "error",
    "react/display-name": "warn",
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-spacing": "error",
    "react/jsx-key": "error",
    "react/jsx-no-bind": "off",
    "react/no-unescaped-entities": "off",
    "react/self-closing-comp": "error",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/no-onchange": "off",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        asyncArrow: "always",
        named: "never",
      },
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "use-isnan": "error",
    "valid-typeof": "off",
  },
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      fragment: "Fragment", // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: "9999.9999",
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { name: "Link", linkAttribute: "to" },
    ],
  },
};
