import { Api } from "@gql/sf/Api";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor } from "@graphql-tools/utils";
import { FilterTypes, introspectSchema } from "@graphql-tools/wrap";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import fs from "fs";
import { printSchema } from "graphql";
import path from "path";
import { getTypeWhitelist } from "./typeWhitelist";

const sfSchemaFilePath = path.join("src", "gql", "schema", "sfSchema.gql");

const getenv = (key: string): string => {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Failed to find environment variable ${key}.`);
};

const main = async () => {
  const whitelist = getTypeWhitelist();

  const executor: AsyncExecutor = async request => {
    const data = await api.executeGraphQL<AnyObject>(request);
    return data;
  };

  const { accessToken, url } = await getSalesforceAccessToken({
    clientId: getenv("SALESFORCE_CLIENT_ID"),
    connectionUrl: getenv("SALESFORCE_CONNECTION_URL"),
    currentUsername: getenv("SALESFORCE_USERNAME"),
  });

  const api = new Api({
    accessToken,
    instanceUrl: url,
    email: getenv("SALESFORCE_USERNAME"),
  });

  const salesforceSchema = await introspectSchema(executor);
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
