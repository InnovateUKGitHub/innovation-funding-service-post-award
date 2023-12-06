import { LogLevel } from "@framework/constants/enums";
import { buildSchema, registerEnumType } from "type-graphql";
import { CurrentUserResolver } from "./resolver/CurrentUserResolver";
import { CompaniesHouseResolver } from "./resolver/CompaniesHouseResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The level of the logging",
});

const getTypeGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [CurrentUserResolver, CompaniesHouseResolver] as const,
  });

  return schema;
};

export { getTypeGraphQLSchema };
