## Schema Folder

To insure the integrity of our `.yaml` files, we are using
`ts-json-schema-generator` to convert the TypeScript schema (found in
`src/schema.ts`) into a JSON schema, which is used by TypeScript to validate the
contents of the YAML file.

To take advantage of this...

1. Install the YAML Language Server in Visual Studio Code. It should be
   published by Red Hat.
2. To rebuild the schema file, run `node schema/` from the ROOT of the
   repository. This means running the code in the folder that contains
   `tsconfig.json`
