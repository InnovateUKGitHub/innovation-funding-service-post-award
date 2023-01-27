import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";

const projectIsActiveResolver: IFieldResolverOptions = {
  selectionSet: `{ Acc_ProjectStatus__c { value } }`,
  async resolve(input, args, ctx: GraphQLContext, info) {
    switch (input.Acc_ProjectStatus__c.value) {
      case "Offer Letter Sent":
      case "Live":
      case "Final Claim":
        return true;
      case "On Hold":
      case "Closed":
      case "Terminated":
      default:
        return false;
    }
  },
};

export { projectIsActiveResolver };
