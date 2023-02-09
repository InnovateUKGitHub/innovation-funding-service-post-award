import { LogLevel } from "@framework/constants";
import { buildSchema, registerEnumType } from "type-graphql";
import { ClientConfigResolver } from "./resolver/client/ClientConfigResolver";
import { ClientCurrentUserResolver } from "./resolver/client/ClientCurrentUserResolver";
import { SalesforceApiProjectResolver } from "./resolver/sf/SalesforceAccProjectResolver";
import { SalesforceApiResolver } from "./resolver/sf/SalesforceApiResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The level of the logging",
});

const getTypeGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [
      ClientConfigResolver,
      ClientCurrentUserResolver,
      SalesforceApiProjectResolver,
      SalesforceApiResolver,
    ] as const,
  });

  return schema;
};

export { getTypeGraphQLSchema };
