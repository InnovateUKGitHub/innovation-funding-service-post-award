/**
 * @generated SignedSource<<ecfcc2c3fb62df597ae3e2b5241d8bfe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Acc_IFSSpendProfile__cUpdateInput = {
  Acc_IFSSpendProfile__c: Acc_IFSSpendProfile__cUpdateRepresentation;
  Id: any;
};
export type Acc_IFSSpendProfile__cUpdateRepresentation = {
  Acc_Amount__c?: number | null | undefined;
  Acc_AwardRate__c?: number | null | undefined;
  Acc_CapitalUsageCostOfItem__c?: number | null | undefined;
  Acc_CostCategoryID__c?: any | null | undefined;
  Acc_CostEach__c?: number | null | undefined;
  Acc_CostOfRole__c?: number | null | undefined;
  Acc_CostOfSubcontractor__c?: number | null | undefined;
  Acc_CostPerItem__c?: number | null | undefined;
  Acc_Country__c?: string | null | undefined;
  Acc_DATotalEstatesCosts__c?: number | null | undefined;
  Acc_DATotalInvestigatorsCosts__c?: number | null | undefined;
  Acc_DATotalOtherCosts__c?: number | null | undefined;
  Acc_DITotalOtherCosts__c?: number | null | undefined;
  Acc_DITotalStaffCosts__c?: number | null | undefined;
  Acc_DITotalTravelCosts__c?: number | null | undefined;
  Acc_DateSecured__c?: string | null | undefined;
  Acc_DaysSpentOnProject__c?: number | null | undefined;
  Acc_DepreciationPeriod__c?: number | null | undefined;
  Acc_ETotalOtherCosts__c?: number | null | undefined;
  Acc_ETotalStaffCosts__c?: number | null | undefined;
  Acc_ForecastInitialValue__c?: number | null | undefined;
  Acc_ForecastLatestValue__c?: number | null | undefined;
  Acc_FundingSought__c?: number | null | undefined;
  Acc_GolValue__c?: number | null | undefined;
  Acc_GrossCostOfRole__c?: number | null | undefined;
  Acc_ItemDescription__c?: any | null | undefined;
  Acc_Item__c?: string | null | undefined;
  Acc_MaterialsCostOfItem__c?: number | null | undefined;
  Acc_Name__c?: string | null | undefined;
  Acc_NetPresentValue__c?: number | null | undefined;
  Acc_NewOrExisting__c?: string | null | undefined;
  Acc_NumberOfTimes__c?: number | null | undefined;
  Acc_OCDescription__c?: any | null | undefined;
  Acc_OtherCostsCostOfItem__c?: number | null | undefined;
  Acc_OtherFunding__c?: boolean | null | undefined;
  Acc_OverheadRate__c?: string | null | undefined;
  Acc_PartnerContribution__c?: number | null | undefined;
  Acc_PeriodForecastStatus__c?: string | null | undefined;
  Acc_ProjectChangeRequest__c?: any | null | undefined;
  Acc_ProjectParticipantID__c?: any | null | undefined;
  Acc_ProjectPeriodEndDate__c?: string | null | undefined;
  Acc_ProjectPeriodNumber__c?: number | null | undefined;
  Acc_ProjectPeriodStartDate__c?: string | null | undefined;
  Acc_Quantity__c?: number | null | undefined;
  Acc_Rate__c?: number | null | undefined;
  Acc_ResidualValue__c?: number | null | undefined;
  Acc_RoleAndDescription__c?: any | null | undefined;
  Acc_Role__c?: string | null | undefined;
  Acc_Source__c?: string | null | undefined;
  Acc_TSBReference__c?: string | null | undefined;
  Acc_TSDescription__c?: string | null | undefined;
  Acc_TotalCapitalUsageCosts__c?: number | null | undefined;
  Acc_TotalCostCategoryValue__c?: number | null | undefined;
  Acc_TotalCost__c?: number | null | undefined;
  Acc_TotalDirectlyAllocatedCosts__c?: number | null | undefined;
  Acc_TotalDirectlyIncurredCosts__c?: number | null | undefined;
  Acc_TotalExceptionsCosts__c?: number | null | undefined;
  Acc_TotalFutureCostCategoryValue__c?: number | null | undefined;
  Acc_TotalGolvalue__c?: number | null | undefined;
  Acc_TotalIndirectCosts1__c?: number | null | undefined;
  Acc_TotalIndirectCosts__c?: number | null | undefined;
  Acc_TotalLabourCosts__c?: number | null | undefined;
  Acc_TotalMaterialsCosts__c?: number | null | undefined;
  Acc_TotalOtherCosts__c?: number | null | undefined;
  Acc_TotalOverheadCosts1__c?: number | null | undefined;
  Acc_TotalOverheadCosts__c?: number | null | undefined;
  Acc_TotalProjectCosts__c?: number | null | undefined;
  Acc_TotalSubcontractingCosts__c?: number | null | undefined;
  Acc_TotalTravelCosts__c?: number | null | undefined;
  Acc_TotalValue__c?: number | null | undefined;
  Acc_TravelCostOfItem__c?: number | null | undefined;
  Acc_Utilisation__c?: number | null | undefined;
  OwnerId?: any | null | undefined;
  RecordTypeId?: any | null | undefined;
};
export type SpendProfileUpdateItemMutation$variables = {
  input: Acc_IFSSpendProfile__cUpdateInput;
  projectId: string;
};
export type SpendProfileUpdateItemMutation$data = {
  readonly uiapi: {
    readonly Acc_IFSSpendProfile__cUpdate: {
      readonly success: boolean | null | undefined;
    } | null | undefined;
  };
};
export type SpendProfileUpdateItemMutation = {
  response: SpendProfileUpdateItemMutation$data;
  variables: SpendProfileUpdateItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectId"
      }
    ],
    "concreteType": "UIAPIMutations",
    "kind": "LinkedField",
    "name": "uiapi",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input"
          }
        ],
        "concreteType": "Acc_IFSSpendProfile__cUpdatePayload",
        "kind": "LinkedField",
        "name": "Acc_IFSSpendProfile__cUpdate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "success",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SpendProfileUpdateItemMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SpendProfileUpdateItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c8d97512a8ed6d607ccb4d0383b908ed",
    "id": null,
    "metadata": {},
    "name": "SpendProfileUpdateItemMutation",
    "operationKind": "mutation",
    "text": "mutation SpendProfileUpdateItemMutation(\n  $input: Acc_IFSSpendProfile__cUpdateInput!\n  $projectId: String!\n) {\n  uiapi(projectId: $projectId) {\n    Acc_IFSSpendProfile__cUpdate(input: $input) {\n      success\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc39635b0234617e06730edd357abb42";

export default node;
