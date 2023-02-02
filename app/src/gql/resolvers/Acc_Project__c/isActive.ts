import type { IFieldResolverOptions } from "@graphql-tools/utils";

const projectIsActiveResolver: IFieldResolverOptions = {
  selectionSet: `{ Acc_ProjectStatus__c { value } }`,
  resolve(input) {
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
