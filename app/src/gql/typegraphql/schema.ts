import { LogLevel } from "@framework/constants";
import { buildSchema, registerEnumType } from "type-graphql";
import { ClientConfigResolver } from "./resolver/ClientConfigResolver";
import { CurrentUserResolver } from "./resolver/CurrentUserResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The level of the logging",
});

const getTypeGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [ClientConfigResolver, CurrentUserResolver] as const,
  });

  return schema;
};

export { getTypeGraphQLSchema };
