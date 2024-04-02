/**
 * @generated SignedSource<<9043cb0110f33cac505b17881f6d34f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PcrFinancialVirementQuery$variables = {
  itemId?: string | null | undefined;
  pcrId?: string | null | undefined;
  projectId?: string | null | undefined;
};
export type PcrFinancialVirementQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Profile__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategoryAwardOverride__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
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
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null | undefined;
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
              readonly Acc_AccountId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectRole__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_NonFEC__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly isSalesforceSystemUser: boolean;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_VirementsForCosts: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimedCostsToDate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ParticipantVirement__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Profile__r: {
                readonly Acc_CostCategory__r: {
                  readonly Acc_CostCategoryName__c: {
                    readonly value: string | null | undefined;
                  } | null | undefined;
                  readonly Id: string;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_VirementsForParticipant: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CurrentAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewRemainingGrant__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewTotalEligibleCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectChangeRequest__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly ChildPcr: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_GrantMovingOverFinancialYear__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_MarkedasComplete__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly ParentPcr: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Reasoning__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"PageFragment">;
    };
  };
};
export type PcrFinancialVirementQuery = {
  response: PcrFinancialVirementQuery$data;
  variables: PcrFinancialVirementQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "itemId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "itemId"
  }
],
v4 = {
  "fields": (v3/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_ProjectChangeRequest__c"
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectParticipant__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": "Acc_VirementsForParticipant",
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 200
    },
    {
      "fields": [
        (v4/*: any*/),
        {
          "kind": "Literal",
          "name": "RecordType",
          "value": {
            "DeveloperName": {
              "eq": "Acc_VirementsForParticipant"
            }
          }
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_Virements__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Virements__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Virements__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Virements__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v5/*: any*/),
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectChangeRequest__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_NewAwardRate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentAwardRate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_NewTotalEligibleCosts__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_NewRemainingGrant__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v10 = {
  "order": "ASC"
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": "Acc_VirementsForCosts",
  "args": [
    (v9/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_Profile__r": {
          "Acc_CostCategory__r": {
            "Acc_DisplayOrder__c": (v10/*: any*/)
          }
        }
      }
    },
    {
      "fields": [
        {
          "fields": [
            (v4/*: any*/)
          ],
          "kind": "ObjectValue",
          "name": "Acc_ParticipantVirement__r"
        },
        {
          "kind": "Literal",
          "name": "RecordType",
          "value": {
            "DeveloperName": {
              "eq": "Acc_VirementsForCosts"
            }
          }
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_Virements__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Virements__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Virements__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Virements__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Acc_Profile__c",
              "kind": "LinkedField",
              "name": "Acc_Profile__r",
              "plural": false,
              "selections": [
                (v5/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Acc_CostCategory__c",
                  "kind": "LinkedField",
                  "name": "Acc_CostCategory__r",
                  "plural": false,
                  "selections": [
                    (v5/*: any*/),
                    (v11/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_ParticipantVirement__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentCosts__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimedCostsToDate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_NewCosts__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v13 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v14 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v15 = [
  (v13/*: any*/),
  {
    "fields": [
      {
        "fields": (v14/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": (v15/*: any*/),
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
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_NonFEC__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Ext_Project_Roles",
              "kind": "LinkedField",
              "name": "roles",
              "plural": false,
              "selections": [
                (v16/*: any*/),
                (v17/*: any*/),
                (v18/*: any*/),
                (v19/*: any*/),
                (v20/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_CompetitionType__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v22 = [
  {
    "fields": (v14/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectId__c"
  }
],
v23 = {
  "alias": null,
  "args": [
    (v9/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_AccountId__r": {
          "Name": (v10/*: any*/)
        }
      }
    },
    {
      "fields": (v22/*: any*/),
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
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Account",
              "kind": "LinkedField",
              "name": "Acc_AccountId__r",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Name",
                  "plural": false,
                  "selections": (v6/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectRole__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v24 = {
  "alias": "ParentPcr",
  "args": [
    (v13/*: any*/),
    {
      "fields": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "eq",
              "variableName": "pcrId"
            }
          ],
          "kind": "ObjectValue",
          "name": "Id"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_ProjectChangeRequest__cConnection",
  "kind": "LinkedField",
  "name": "Acc_ProjectChangeRequest__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_ProjectChangeRequest__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_ProjectChangeRequest__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "LongTextAreaValue",
              "kind": "LinkedField",
              "name": "Acc_Reasoning__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v25 = {
  "alias": "ChildPcr",
  "args": [
    (v13/*: any*/),
    {
      "fields": [
        {
          "fields": (v3/*: any*/),
          "kind": "ObjectValue",
          "name": "Id"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_ProjectChangeRequest__cConnection",
  "kind": "LinkedField",
  "name": "Acc_ProjectChangeRequest__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_ProjectChangeRequest__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_ProjectChangeRequest__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_GrantMovingOverFinancialYear__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_MarkedasComplete__c",
              "plural": false,
              "selections": (v6/*: any*/),
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
v26 = {
  "alias": null,
  "args": [
    (v9/*: any*/),
    {
      "fields": [
        {
          "items": [
            {
              "fields": [
                {
                  "fields": (v22/*: any*/),
                  "kind": "ObjectValue",
                  "name": "Acc_ProjectParticipant__r"
                }
              ],
              "kind": "ObjectValue",
              "name": "and.0"
            },
            {
              "kind": "Literal",
              "name": "and.1",
              "value": {
                "or": [
                  {
                    "RecordType": {
                      "DeveloperName": {
                        "eq": "Total_Project_Period"
                      }
                    }
                  },
                  {
                    "RecordType": {
                      "DeveloperName": {
                        "eq": "Total_Cost_Category"
                      }
                    }
                  }
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
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_CostCategory__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Acc_CostCategory__c",
              "kind": "LinkedField",
              "name": "Acc_CostCategory__r",
              "plural": false,
              "selections": [
                (v11/*: any*/)
              ],
              "storageKey": null
            },
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_CostCategoryGOLCost__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_OverrideAwardRate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodNumber__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_ProfileOverrideAwardRate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PercentValue",
              "kind": "LinkedField",
              "name": "Acc_CostCategoryAwardOverride__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodStartDate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodEndDate__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_LatestForecastCost__c",
              "plural": false,
              "selections": (v6/*: any*/),
              "storageKey": null
            },
            {
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
                  "selections": (v6/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PcrFinancialVirementQuery",
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
                "name": "PageFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v12/*: any*/),
                  (v21/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PcrFinancialVirementQuery",
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
                    "alias": "Page",
                    "args": (v15/*: any*/),
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
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isActive",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v16/*: any*/),
                                  (v17/*: any*/),
                                  (v18/*: any*/),
                                  (v19/*: any*/),
                                  (v20/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v16/*: any*/),
                                      (v17/*: any*/),
                                      (v18/*: any*/),
                                      (v19/*: any*/),
                                      (v20/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "partnerId",
                                        "storageKey": null
                                      }
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
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectStatus__c",
                                "plural": false,
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              },
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
                                          (v5/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
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
                  (v8/*: any*/),
                  (v12/*: any*/),
                  (v21/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/)
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
    "cacheID": "57816d29572b77e893e363dc39b84052",
    "id": null,
    "metadata": {},
    "name": "PcrFinancialVirementQuery",
    "operationKind": "query",
    "text": "query PcrFinancialVirementQuery(\n  $projectId: ID\n  $pcrId: ID\n  $itemId: ID\n) {\n  salesforce {\n    uiapi {\n      ...PageFragment\n      query {\n        Acc_VirementsForParticipant: Acc_Virements__c(where: {Acc_ProjectChangeRequest__c: {eq: $itemId}, RecordType: {DeveloperName: {eq: \"Acc_VirementsForParticipant\"}}}, first: 200) {\n          edges {\n            node {\n              Id\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_ProjectChangeRequest__c {\n                value\n              }\n              Acc_NewAwardRate__c {\n                value\n              }\n              Acc_CurrentAwardRate__c {\n                value\n              }\n              Acc_NewTotalEligibleCosts__c {\n                value\n              }\n              Acc_NewRemainingGrant__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_VirementsForCosts: Acc_Virements__c(where: {Acc_ParticipantVirement__r: {Acc_ProjectChangeRequest__c: {eq: $itemId}}, RecordType: {DeveloperName: {eq: \"Acc_VirementsForCosts\"}}}, orderBy: {Acc_Profile__r: {Acc_CostCategory__r: {Acc_DisplayOrder__c: {order: ASC}}}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_Profile__r {\n                Id\n                Acc_CostCategory__r {\n                  Id\n                  Acc_CostCategoryName__c {\n                    value\n                  }\n                }\n              }\n              Acc_ParticipantVirement__c {\n                value\n              }\n              Acc_CurrentCosts__c {\n                value\n              }\n              Acc_ClaimedCostsToDate__c {\n                value\n              }\n              Acc_NewCosts__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Acc_NonFEC__c {\n                value\n              }\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                isSalesforceSystemUser\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {Acc_ProjectId__c: {eq: $projectId}}, orderBy: {Acc_AccountId__r: {Name: {order: ASC}}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n            }\n          }\n        }\n        ParentPcr: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrId}}, first: 1) {\n          edges {\n            node {\n              Acc_Reasoning__c {\n                value\n              }\n            }\n          }\n        }\n        ChildPcr: Acc_ProjectChangeRequest__c(where: {Id: {eq: $itemId}}, first: 1) {\n          edges {\n            node {\n              Acc_GrantMovingOverFinancialYear__c {\n                value\n              }\n              Acc_MarkedasComplete__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__r: {Acc_ProjectId__c: {eq: $projectId}}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategory__r {\n                Acc_CostCategoryName__c {\n                  value\n                }\n              }\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_OverrideAwardRate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProfileOverrideAwardRate__c {\n                value\n              }\n              Acc_CostCategoryAwardOverride__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6769362641c83a94cd6fce08b95ae022";

export default node;
