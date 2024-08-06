/**
 * @generated SignedSource<<2ac34eba1a1649786ae3e9e5cd9a0e21>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Acc_IFSSpendProfile__cCreateInput = {
  Acc_IFSSpendProfile__c: Acc_IFSSpendProfile__cCreateRepresentation;
};
export type Acc_IFSSpendProfile__cCreateRepresentation = {
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
export type SpendProfileCreateItemMutation$variables = {
  input: Acc_IFSSpendProfile__cCreateInput;
  projectId: string;
};
export type SpendProfileCreateItemMutation$data = {
  readonly uiapi: {
    readonly Acc_IFSSpendProfile__cCreate: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
  };
};
export type SpendProfileCreateItemMutation = {
  response: SpendProfileCreateItemMutation$data;
  variables: SpendProfileCreateItemMutation$variables;
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
        "concreteType": "Acc_IFSSpendProfile__cCreatePayload",
        "kind": "LinkedField",
        "name": "Acc_IFSSpendProfile__cCreate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Acc_IFSSpendProfile__c",
            "kind": "LinkedField",
            "name": "Record",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "Id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StringValue",
                "kind": "LinkedField",
                "name": "Name",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
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
    "name": "SpendProfileCreateItemMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SpendProfileCreateItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f5afbd03f7373c4fbe2a2d8aadb8e863",
    "id": null,
    "metadata": {},
    "name": "SpendProfileCreateItemMutation",
    "operationKind": "mutation",
    "text": "mutation SpendProfileCreateItemMutation(\n  $input: Acc_IFSSpendProfile__cCreateInput!\n  $projectId: String!\n) {\n  uiapi(projectId: $projectId) {\n    Acc_IFSSpendProfile__cCreate(input: $input) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "850a2e36a3b48e9e64bafa2eb4e4709a";

export default node;
