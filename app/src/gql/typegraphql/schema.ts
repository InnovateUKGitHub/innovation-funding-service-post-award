import { LogLevel } from "@framework/constants";
import { buildSchema, registerEnumType } from "type-graphql";
import { SalesforceAccProjectConnectionDocumentTypeEnum } from "./enum/SalesforceAccProjectConnectionDocumentTypeEnum";
import { ClientConfigResolver } from "./resolver/ClientConfigResolver";
import { CurrentUserResolver } from "./resolver/CurrentUserResolver";
import { SalesforceAccProjectConnectionResolver } from "./resolver/SalesforceAccProjectConnectionResolver";

registerEnumType(LogLevel, {
  name: "LogLevel",
  description: "The log level of the IFSPA server/client application",
});

registerEnumType(SalesforceAccProjectConnectionDocumentTypeEnum, {
  name: "SalesforceAccProjectConnectionDocumentTypeEnum",
  description: "The document type of the uploaded document",
});

const getTypeGraphQLSchema = async () => {
  const schema = await buildSchema({
    resolvers: [ClientConfigResolver, CurrentUserResolver, SalesforceAccProjectConnectionResolver] as const,
  });

  return schema;
};

export { getTypeGraphQLSchema };
