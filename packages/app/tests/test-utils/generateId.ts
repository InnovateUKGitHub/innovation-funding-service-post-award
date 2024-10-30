import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";

type IdMap = {
  ProjectId: ProjectId;
  PcrId: PcrId;
  PcrItemId: PcrItemId;
  ProjectParticipantId: PartnerId;
  CostCategoryId: CostCategoryId;
  CostId: CostId;
  AccountId: AccountId;
  LoanId: LoanId;
  DocumentId: string;
};

type IdType = keyof IdMap;

type InferIdType<T extends IdType> = T extends infer U ? (U extends keyof IdMap ? IdMap[U] : never) : never;

const getPrefix = (idType: IdType) => {
  switch (idType) {
    case "ProjectId":
      return SalesforcePrefixes.Acc_Project__c;
    case "PcrId":
    case "PcrItemId":
      return SalesforcePrefixes.Acc_ProjectChangeRequest__c;
    case "ProjectParticipantId":
      return SalesforcePrefixes.Acc_ProjectParticipant__c;
    case "CostCategoryId":
      return SalesforcePrefixes.Acc_CostCategory__c;
    case "CostId":
      return SalesforcePrefixes.Acc_IFSSpendProfile__c;
    case "AccountId":
      return SalesforcePrefixes.Account;
    case "LoanId":
      return SalesforcePrefixes.Acc_Prepayment__c;
    case "DocumentId":
      return "";
  }
};

export const generateId = <T extends IdType>(idType: T): InferIdType<T> => {
  const prefix = getPrefix(idType);

  const randomNumber = Math.random().toString(36).substring(2, 18);
  return `${prefix}${randomNumber}` as InferIdType<T>;
};
