import { LogLevel } from "@framework/constants";
import { buildSchema, registerEnumType } from "type-graphql";
import { ClientConfigResolver } from "./resolver/ClientConfigResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The level of the logging",
});

const getGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [ClientConfigResolver] as const,
    emitSchemaFile: true,
  });

  return schema;
};

export { getGraphQLSchema };
