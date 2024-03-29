// @ts-check

const tsj = require("ts-json-schema-generator");
const fs = require("fs");

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: "src/schema/index.ts",
  type: "BaseFileData", // Or <type-name> if you want to generate schema for that one type only
  topRef: false,
};

const output_path = "schema/baseFile.schema.json";

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err) => {
  if (err) throw err;
});
