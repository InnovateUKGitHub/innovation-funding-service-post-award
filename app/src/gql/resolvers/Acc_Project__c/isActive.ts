import type { IFieldResolverOptions } from "@graphql-tools/utils";

const getIsActive = (status: string) => {
  switch (status) {
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
};

const projectIsActiveResolver: IFieldResolverOptions = {
  selectionSet: `{ Acc_ProjectStatus__c { value } }`,
  resolve(input) {
    return getIsActive(input.Acc_ProjectStatus__c.value);
  },
};

export { projectIsActiveResolver, getIsActive };
