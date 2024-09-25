import { TsforceConnection } from "@server/tsforce/TsforceConnection";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor } from "@graphql-tools/utils";
import { FilterTypes, schemaFromExecutor } from "@graphql-tools/wrap";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import fs from "fs";
import { printSchema } from "graphql";
import path from "path";
import { getTypeWhitelist } from "./typeWhitelist";

const sfSchemaFilePath = path.join("src", "gql", "schema", "sfSchema.gql");

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Failed to find environment variable ${key}.`);
};

const main = async () => {
  const whitelist = getTypeWhitelist();

  const { accessToken, url } = await getSalesforceAccessToken({
    clientId: getEnv("SALESFORCE_CLIENT_ID"),
    connectionUrl: getEnv("SALESFORCE_CONNECTION_URL"),
    currentUsername: getEnv("SALESFORCE_USERNAME"),
  });

  const api = new TsforceConnection({
    accessToken,
    instanceUrl: url,
    email: getEnv("SALESFORCE_USERNAME"),
    tid: "init",
  });

  const salesforceSchema = await schemaFromExecutor(api.executeGraphQL.bind(api) as unknown as AsyncExecutor);

  const transformedSchema = {
    schema: salesforceSchema,
    transforms: [new FilterTypes(type => whitelist.includes(type.name))],
  };

  const schema = stitchSchemas({
    subschemas: [transformedSchema],
    mergeDirectives: true,
  });

  fs.writeFileSync(sfSchemaFilePath, printSchema(schema), { encoding: "utf-8" });
};

main();
