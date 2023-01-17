module.exports = {
  presets: ["@babel/env", "@babel/react", "@babel/preset-typescript"],
  plugins: [
    "relay",
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
  ],
};
