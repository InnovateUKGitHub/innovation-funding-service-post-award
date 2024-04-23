import { LogLevel } from "@framework/constants/enums";
import { buildSchema, registerEnumType } from "type-graphql";
import { CurrentUserResolver } from "./resolver/CurrentUserResolver";
import { CompaniesHouseResolver } from "./resolver/CompaniesHouseResolver";
import { DeveloperResolver } from "./resolver/DeveloperResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The level of the logging",
});

const getTypeGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [CurrentUserResolver, CompaniesHouseResolver, DeveloperResolver] as const,
  });

  return schema;
};

export { getTypeGraphQLSchema };
