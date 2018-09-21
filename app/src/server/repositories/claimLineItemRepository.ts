import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimLineItem {
  Id: string;
  Acc_LineItemDesc__c: string;
  Acc_LineItemValue__c: number;
  Acc_ClaimId__r: string;
  Acc_CostCategoryId__c: number;
}

const fields = [
  "Id",
  "Acc_LineItemDesc__c",
  "Acc_LineItemValue__c",
  // TODO get real field names
  "Acc_ClaimId__r",
  "Acc_CostCategoryId__c"
];

export interface IClaimLineItemRepository {
  getAllForClaimByCategoryId(claimId: string, categoryId: number): Promise<ISalesforceClaimLineItem[]>;
}

export class ClaimLineItemRepository extends SalesforceBase<ISalesforceClaimLineItem> implements IClaimLineItemRepository {
  constructor() {
    super("Acc_ClaimLineItem__c", fields);
  }

  getAllForClaimByCategoryId(claimId: string, categoryId: number): Promise<ISalesforceClaimLineItem[]> {
    // return super.whereFilter(x => x.Acc_ClaimId__r === claimId && x.Acc_CostCategoryId__c === categoryId);
    // TODO remove stubbed data
    return Promise.resolve([
      {
        Id: "1",
        Acc_LineItemDesc__c: "Project manager working full-time throughout the quarter, on pay scale B3.",
        Acc_LineItemValue__c: 3000,
        Acc_ClaimId__r: "1234567890",
        Acc_CostCategoryId__c: 1
      }, {
        Id: "2",
        Acc_LineItemDesc__c: "Electrician who worked full-time for 3 weeks (15 days total) on a salary of £45,000 pro-rata",
        Acc_LineItemValue__c: 2400,
        Acc_ClaimId__r: "1234567890",
        Acc_CostCategoryId__c: 1,
      }, {
        Id: "3",
        Acc_LineItemDesc__c: "15 conical flasks for mixing chemicals, priced at £1,000 each",
        Acc_LineItemValue__c: 15000,
        Acc_ClaimId__r: "1234567890",
        Acc_CostCategoryId__c: 3,
      }, {
        Id: "4",
        Acc_LineItemDesc__c: "Large chemical cleaning machine",
        Acc_LineItemValue__c: 4600,
        Acc_ClaimId__r: "1234567890",
        Acc_CostCategoryId__c: 3,
      }
    ].filter(lineItem => lineItem.Acc_CostCategoryId__c === categoryId));
  }
}
