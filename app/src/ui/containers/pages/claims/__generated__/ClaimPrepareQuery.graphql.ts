/**
 * @generated SignedSource<<7f41c37b1348d9936c1714b113f987f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClaimPrepareQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null | undefined;
};
export type ClaimPrepareQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Claims__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ApprovedDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ClaimStatus__c: {
                readonly label: string | null | undefined;
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategory__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_Grant_Paid_To_Date__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_PaidDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_PeriodCostCategoryTotal__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_PeriodCoststobePaid__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipant__r: {
                readonly Acc_AccountId__r: {
                  readonly Name: {
                    readonly value: string | null | undefined;
                  } | null | undefined;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
              readonly Acc_ProjectPeriodCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodStartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_TotalCostsApproved__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_TotalCostsSubmitted__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_TotalDeferredAmount__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly LastModifiedDate: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_CostCategory__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategoryName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_DisplayOrder__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Profile__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategoryGOLCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategory__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategory__r: {
                readonly Acc_CostCategoryName__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
              readonly Acc_LatestForecastCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OverrideAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProfileOverrideAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodStartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AccountId__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AccountId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_Award_Rate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ParticipantStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectRole__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_StaticCapLimitGrant__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_TotalGrantApproved__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_TotalParticipantCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimFrequency__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ClaimsOverdue__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ClaimsUnderQuery__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CompetitionId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_GOLTotalCostAwarded__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NonFEC__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly isActive: boolean;
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly partnerRoles: ReadonlyArray<{
                  readonly isAssociate: boolean;
                  readonly isFc: boolean;
                  readonly isMo: boolean;
                  readonly isPm: boolean;
                  readonly partnerId: string;
                }>;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"AwardRateOverridesMessageFragment" | "PageFragment" | "StatusChangesLogsFragment">;
    };
  };
};
export type ClaimPrepareQuery = {
  response: ClaimPrepareQuery$data;
  variables: ClaimPrepareQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "periodId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectIdStr"
},
v4 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v5 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v6 = [
  {
    "fields": (v5/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectParticipant__c"
  }
],
v7 = {
  "fields": (v6/*: any*/),
  "kind": "ObjectValue",
  "name": "and.0"
},
v8 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Cost_Category"
    }
  }
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v11 = [
  (v10/*: any*/)
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "RecordType",
  "kind": "LinkedField",
  "name": "RecordType",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StringValue",
      "kind": "LinkedField",
      "name": "DeveloperName",
      "plural": false,
      "selections": (v11/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryGOLCost__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_OverrideAwardRate__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_ProfileOverrideAwardRate__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_LatestForecastCost__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": [
    (v4/*: any*/),
    {
      "fields": [
        {
          "items": [
            (v7/*: any*/),
            {
              "kind": "Literal",
              "name": "and.1",
              "value": {
                "or": [
                  {
                    "RecordType": {
                      "DeveloperName": {
                        "eq": "Profile_Detail"
                      }
                    }
                  },
                  (v8/*: any*/)
                ]
              }
            }
          ],
          "kind": "ListValue",
          "name": "and"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_Profile__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Profile__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Profile__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Profile__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v9/*: any*/),
            (v12/*: any*/),
            (v13/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Acc_CostCategory__c",
              "kind": "LinkedField",
              "name": "Acc_CostCategory__r",
              "plural": false,
              "selections": [
                (v9/*: any*/),
                (v14/*: any*/)
              ],
              "storageKey": null
            },
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v21/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v23 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Project_Period"
    }
  }
},
v24 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "StringValue",
    "kind": "LinkedField",
    "name": "Name",
    "plural": false,
    "selections": (v11/*: any*/),
    "storageKey": null
  }
],
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "Account",
  "kind": "LinkedField",
  "name": "Acc_AccountId__r",
  "plural": false,
  "selections": (v24/*: any*/),
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": [
    (v4/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_ProjectParticipant__r": {
          "Acc_AccountId__r": {
            "Name": {
              "order": "ASC"
            }
          }
        }
      }
    },
    {
      "fields": [
        {
          "items": [
            {
              "fields": [
                {
                  "fields": [
                    {
                      "kind": "Variable",
                      "name": "eq",
                      "variableName": "projectIdStr"
                    }
                  ],
                  "kind": "ObjectValue",
                  "name": "Acc_ProjectID__c"
                }
              ],
              "kind": "ObjectValue",
              "name": "and.0"
            },
            {
              "fields": (v6/*: any*/),
              "kind": "ObjectValue",
              "name": "and.1"
            },
            {
              "kind": "Literal",
              "name": "and.2",
              "value": {
                "or": [
                  (v23/*: any*/),
                  {
                    "RecordType": {
                      "DeveloperName": {
                        "eq": "Claims_Detail"
                      }
                    }
                  }
                ]
              }
            },
            {
              "kind": "Literal",
              "name": "and.3",
              "value": {
                "Acc_ClaimStatus__c": {
                  "ne": "New"
                }
              }
            },
            {
              "kind": "Literal",
              "name": "and.4",
              "value": {
                "Acc_ClaimStatus__c": {
                  "ne": "Not used"
                }
              }
            }
          ],
          "kind": "ListValue",
          "name": "and"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_Claims__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Claims__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Claims__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Claims__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v9/*: any*/),
            (v12/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_Grant_Paid_To_Date__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Acc_ProjectParticipant__c",
              "kind": "LinkedField",
              "name": "Acc_ProjectParticipant__r",
              "plural": false,
              "selections": [
                (v9/*: any*/),
                (v25/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateTimeValue",
              "kind": "LinkedField",
              "name": "LastModifiedDate",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_ApprovedDate__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimStatus__c",
              "plural": false,
              "selections": [
                (v10/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "label",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_PaidDate__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            (v20/*: any*/),
            (v19/*: any*/),
            (v17/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodCost__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_PeriodCostCategoryTotal__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_PeriodCoststobePaid__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalCostsApproved__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalCostsSubmitted__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalDeferredAmount__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_FinalClaim__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            (v13/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": [
    (v4/*: any*/)
  ],
  "concreteType": "Acc_CostCategory__cConnection",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_CostCategory__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_CostCategory__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v9/*: any*/),
            (v14/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_DisplayOrder__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_OrganisationType__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_CompetitionType__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "Acc_CostCategory__c(first:2000)"
},
v28 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ParticipantStatus__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": [
    (v4/*: any*/),
    {
      "fields": [
        {
          "items": [
            {
              "fields": [
                {
                  "fields": (v28/*: any*/),
                  "kind": "ObjectValue",
                  "name": "Acc_ProjectId__c"
                }
              ],
              "kind": "ObjectValue",
              "name": "and.0"
            },
            {
              "fields": [
                {
                  "fields": (v5/*: any*/),
                  "kind": "ObjectValue",
                  "name": "Id"
                }
              ],
              "kind": "ObjectValue",
              "name": "and.1"
            }
          ],
          "kind": "ListValue",
          "name": "and"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_ProjectParticipant__cConnection",
  "kind": "LinkedField",
  "name": "Acc_ProjectParticipant__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_ProjectParticipant__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_ProjectParticipant__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v9/*: any*/),
            (v25/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_AccountId__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectRole__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_OrganisationType__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            (v29/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_Award_Rate__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_StaticCapLimitGrant__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalParticipantCosts__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalGrantApproved__c",
              "plural": false,
              "selections": (v11/*: any*/),
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
},
v31 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  {
    "fields": [
      {
        "fields": (v28/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isActive",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "partnerId",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "BooleanValue",
  "kind": "LinkedField",
  "name": "Acc_NonFEC__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectStatus__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": (v31/*: any*/),
  "concreteType": "Acc_Project__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Project__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Project__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Project__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v9/*: any*/),
            (v32/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Ext_Project_Roles",
              "kind": "LinkedField",
              "name": "roles",
              "plural": false,
              "selections": [
                (v33/*: any*/),
                (v34/*: any*/),
                (v35/*: any*/),
                (v36/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Ext_Partner_Roles",
                  "kind": "LinkedField",
                  "name": "partnerRoles",
                  "plural": true,
                  "selections": [
                    (v33/*: any*/),
                    (v34/*: any*/),
                    (v35/*: any*/),
                    (v36/*: any*/),
                    (v37/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            (v38/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Competition__c",
              "kind": "LinkedField",
              "name": "Acc_CompetitionId__r",
              "plural": false,
              "selections": (v24/*: any*/),
              "storageKey": null
            },
            (v39/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_NumberofPeriods__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentPeriodNumber__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimsUnderQuery__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            (v40/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimFrequency__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_GOLTotalCostAwarded__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimsOverdue__c",
              "plural": false,
              "selections": (v11/*: any*/),
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
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimPrepareQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SalesforceQuery",
        "kind": "LinkedField",
        "name": "salesforce",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UIAPI",
            "kind": "LinkedField",
            "name": "uiapi",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "StatusChangesLogsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PageFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AwardRateOverridesMessageFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v22/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v30/*: any*/),
                  (v41/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClaimPrepareQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SalesforceQuery",
        "kind": "LinkedField",
        "name": "salesforce",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UIAPI",
            "kind": "LinkedField",
            "name": "uiapi",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  {
                    "alias": "StatusChanges_Project",
                    "args": (v31/*: any*/),
                    "concreteType": "Acc_Project__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_Project__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Project__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_Project__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v39/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v34/*: any*/),
                                  (v35/*: any*/),
                                  (v33/*: any*/),
                                  (v36/*: any*/)
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
                  },
                  {
                    "alias": "StatusChanges_StatusChanges",
                    "args": [
                      (v4/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "orderBy",
                        "value": {
                          "CreatedDate": {
                            "order": "DESC"
                          }
                        }
                      },
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "items": [
                                  (v7/*: any*/),
                                  {
                                    "fields": [
                                      {
                                        "fields": [
                                          {
                                            "kind": "Variable",
                                            "name": "eq",
                                            "variableName": "periodId"
                                          }
                                        ],
                                        "kind": "ObjectValue",
                                        "name": "Acc_ProjectPeriodNumber__c"
                                      }
                                    ],
                                    "kind": "ObjectValue",
                                    "name": "and.1"
                                  }
                                ],
                                "kind": "ListValue",
                                "name": "and"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "Acc_Claim__r"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "where"
                      }
                    ],
                    "concreteType": "Acc_StatusChange__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_StatusChange__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_StatusChange__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_StatusChange__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "TextAreaValue",
                                "kind": "LinkedField",
                                "name": "Acc_NewClaimStatus__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "LongTextAreaValue",
                                "kind": "LinkedField",
                                "name": "Acc_ExternalComment__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_ParticipantVisibility__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_CreatedByAlias__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateTimeValue",
                                "kind": "LinkedField",
                                "name": "CreatedDate",
                                "plural": false,
                                "selections": (v11/*: any*/),
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
                  },
                  {
                    "alias": "Page",
                    "args": (v31/*: any*/),
                    "concreteType": "Acc_Project__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_Project__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Project__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_Project__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v32/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v33/*: any*/),
                                  (v34/*: any*/),
                                  (v35/*: any*/),
                                  (v36/*: any*/),
                                  (v42/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v33/*: any*/),
                                      (v34/*: any*/),
                                      (v35/*: any*/),
                                      (v36/*: any*/),
                                      (v42/*: any*/),
                                      (v37/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectNumber__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              (v40/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_MonitoringLevel__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              (v39/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_ProjectParticipant__cConnection",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectParticipantsProject__r",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Acc_ProjectParticipant__cEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Acc_ProjectParticipant__c",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v9/*: any*/),
                                          (v29/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v11/*: any*/),
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
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "AwardRateOverridesMessage_Project",
                    "args": (v31/*: any*/),
                    "concreteType": "Acc_Project__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_Project__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Project__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_Project__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v38/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "AwardRateOverridesMessage_Profile",
                    "args": [
                      (v4/*: any*/),
                      {
                        "fields": [
                          {
                            "items": [
                              (v7/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "and.1",
                                "value": {
                                  "or": [
                                    (v23/*: any*/),
                                    (v8/*: any*/)
                                  ]
                                }
                              }
                            ],
                            "kind": "ListValue",
                            "name": "and"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "where"
                      }
                    ],
                    "concreteType": "Acc_Profile__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_Profile__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Profile__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_Profile__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v13/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_CostCategory__c",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategory__r",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PercentValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategoryAwardOverride__c",
                                "plural": false,
                                "selections": (v11/*: any*/),
                                "storageKey": null
                              },
                              (v19/*: any*/),
                              (v20/*: any*/),
                              (v21/*: any*/),
                              (v12/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v30/*: any*/),
                  (v41/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3c061c0ab7cdee63e9e596d0846a698c",
    "id": null,
    "metadata": {},
    "name": "ClaimPrepareQuery",
    "operationKind": "query",
    "text": "query ClaimPrepareQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  salesforce {\n    uiapi {\n      ...StatusChangesLogsFragment\n      ...PageFragment\n      ...AwardRateOverridesMessageFragment\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategory__r {\n                Id\n                Acc_CostCategoryName__c {\n                  value\n                }\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_OverrideAwardRate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProfileOverrideAwardRate__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}]}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_ClaimStatus__c: {ne: \"Not used\"}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_Grant_Paid_To_Date__c {\n                value\n              }\n              Acc_ProjectParticipant__r {\n                Id\n                Acc_AccountId__r {\n                  Name {\n                    value\n                  }\n                }\n              }\n              LastModifiedDate {\n                value\n              }\n              Acc_ApprovedDate__c {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_PeriodCoststobePaid__c {\n                value\n              }\n              Acc_TotalCostsApproved__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_TotalDeferredAmount__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountId__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n              Acc_Award_Rate__c {\n                value\n              }\n              Acc_StaticCapLimitGrant__c {\n                value\n              }\n              Acc_TotalParticipantCosts__c {\n                value\n              }\n              Acc_TotalGrantApproved__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  isAssociate\n                  partnerId\n                }\n              }\n              Acc_NonFEC__c {\n                value\n              }\n              Acc_CompetitionId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_ClaimsUnderQuery__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_ClaimFrequency__c {\n                value\n              }\n              Acc_GOLTotalCostAwarded__c {\n                value\n              }\n              Acc_ClaimsOverdue__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment AwardRateOverridesMessageFragment on UIAPI {\n  query {\n    AwardRateOverridesMessage_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n    AwardRateOverridesMessage_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n          Acc_CostCategoryAwardOverride__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_MonitoringLevel__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n            isAssociate\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "041de5938422faca3c740ec1a30c6a61";

export default node;
