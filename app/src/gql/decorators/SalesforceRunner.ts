import { Request } from "express";
import { createParamDecorator } from "type-graphql";
import { SalesforceConnection } from "@gql/sf/SalesforceConnection";

const SalesforceRunner = (): ParameterDecorator => {
  return createParamDecorator(({ context }: { context: Request }): SalesforceConnection | undefined => {
    return context.sf;
  });
};

export { SalesforceRunner };
