import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { getSalesforceAccessToken } from "@innovateuk/tsforce/TsforceToken";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor } from "@graphql-tools/utils";
import { FilterTypes, schemaFromExecutor } from "@graphql-tools/wrap";
import { printSchema } from "graphql";
import { getTypeWhitelist } from "./typeWhitelist";
import fs from "fs";
import path from "path";
import { getCertificateEnv as certEnv, getStringEnv as strEnv } from "@innovateuk/common/envHelpers";

const sfSchemaFilePath = path.join("src", "gql", "schema", "sfSchema.gql");

const main = async () => {
  const whitelist = getTypeWhitelist();

  const { accessToken, url } = await getSalesforceAccessToken({
    clientId: strEnv("SALESFORCE_CLIENT_ID"),
    connectionUrl: strEnv("SALESFORCE_CONNECTION_URL"),
    currentUsername: strEnv("SALESFORCE_USERNAME"),
    privateKey: certEnv("SALESFORCE_PRIVATE_KEY"),
  });

  const api = new TsforceConnection({
    accessToken,
    instanceUrl: url,
    email: strEnv("SALESFORCE_USERNAME"),
    traceId: "init",
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
