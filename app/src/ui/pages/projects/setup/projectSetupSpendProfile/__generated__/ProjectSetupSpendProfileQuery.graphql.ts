/**
 * @generated SignedSource<<12595ab2d7922036e901c1b469658683>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectSetupSpendProfileQuery$variables = {
  partnerId: string;
  projectId: string;
};
export type ProjectSetupSpendProfileQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_SpendProfileCompleted__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"NewForecastTableFragment" | "PageFragment">;
    };
  };
};
export type ProjectSetupSpendProfileQuery = {
  response: ProjectSetupSpendProfileQuery$data;
  variables: ProjectSetupSpendProfileQuery$variables;
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
  "name": "projectId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v3 = {
  "fields": [
    {
      "fields": (v2/*: any*/),
      "kind": "ObjectValue",
      "name": "Id"
    }
  ],
  "kind": "ObjectValue",
  "name": "where"
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v6 = {
  "alias": null,
  "args": [
    (v3/*: any*/)
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
            (v4/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_SpendProfileCompleted__c",
              "plural": false,
              "selections": (v5/*: any*/),
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
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v8 = [
  (v7/*: any*/),
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "projectId"
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "partnerId",
  "storageKey": null
},
v14 = {
  "kind": "Literal",
  "name": "first",
  "value": 200
},
v15 = {
  "order": "ASC"
},
v16 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "Acc_ProjectPeriodNumber__c": (v15/*: any*/)
  }
},
v17 = {
  "fields": (v2/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_ProjectParticipant__c"
},
v18 = {
  "fields": [
    (v17/*: any*/),
    {
      "kind": "Literal",
      "name": "RecordType",
      "value": {
        "DeveloperName": {
          "eq": "Total_Project_Period"
        }
      }
    }
  ],
  "kind": "ObjectValue",
  "name": "where"
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v22 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v23 = {
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectSetupSpendProfileQuery",
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
                "name": "NewForecastTableFragment"
              },
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
                  (v6/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectSetupSpendProfileQuery",
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
                    "alias": "ForecastTable_Project",
                    "args": (v8/*: any*/),
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
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Acc_NumberofPeriods__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
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
                                  (v9/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v12/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v13/*: any*/),
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      (v11/*: any*/),
                                      (v12/*: any*/)
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
                    "alias": "ForecastTable_ProjectParticipant",
                    "args": [
                      (v7/*: any*/),
                      (v3/*: any*/)
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateTimeValue",
                                "kind": "LinkedField",
                                "name": "Acc_ForecastLastModifiedDate__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PercentValue",
                                "kind": "LinkedField",
                                "name": "Acc_OverheadRate__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
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
                    "alias": "ForecastTable_ClaimTotalProjectPeriods",
                    "args": [
                      (v14/*: any*/),
                      (v16/*: any*/),
                      (v18/*: any*/)
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
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_IAR_Status__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_IARRequired__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ClaimStatus__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              (v20/*: any*/),
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_FinalClaim__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
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
                    "alias": "ForecastTable_ClaimDetails",
                    "args": [
                      (v22/*: any*/),
                      (v16/*: any*/),
                      {
                        "fields": [
                          (v17/*: any*/),
                          {
                            "kind": "Literal",
                            "name": "RecordType",
                            "value": {
                              "DeveloperName": {
                                "eq": "Claims_Detail"
                              }
                            }
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
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_PeriodCostCategoryTotal__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "IDValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategory__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
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
                    "alias": "ForecastTable_ProfileTotalProjectPeriod",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 100
                      },
                      (v18/*: any*/)
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
                  {
                    "alias": "ForecastTable_ProfileTotalCostCategories",
                    "args": [
                      (v22/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "orderBy",
                        "value": {
                          "Acc_CostCategory__r": {
                            "Acc_DisplayOrder__c": (v15/*: any*/)
                          }
                        }
                      },
                      {
                        "fields": [
                          (v17/*: any*/),
                          {
                            "kind": "Literal",
                            "name": "RecordType",
                            "value": {
                              "DeveloperName": {
                                "eq": "Total_Cost_Category"
                              }
                            }
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategoryGOLCost__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
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
                                  (v4/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "StringValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_CostCategoryName__c",
                                    "plural": false,
                                    "selections": (v5/*: any*/),
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
                    "alias": "ForecastTable_ProfileDetails",
                    "args": [
                      (v22/*: any*/),
                      (v16/*: any*/),
                      {
                        "fields": [
                          (v17/*: any*/),
                          {
                            "kind": "Literal",
                            "name": "RecordType",
                            "value": {
                              "DeveloperName": {
                                "eq": "Profile_Detail"
                              }
                            }
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
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_InitialForecastCost__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_LatestForecastCost__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_CostCategory__c",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategory__r",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/)
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
                    "alias": "Page",
                    "args": (v8/*: any*/),
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
                              (v4/*: any*/),
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
                                  (v11/*: any*/),
                                  (v9/*: any*/),
                                  (v10/*: any*/),
                                  (v12/*: any*/),
                                  (v23/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v11/*: any*/),
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      (v12/*: any*/),
                                      (v23/*: any*/),
                                      (v13/*: any*/)
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
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectStatus__c",
                                "plural": false,
                                "selections": (v5/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": [
                                  (v14/*: any*/)
                                ],
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
                                          (v4/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v5/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v5/*: any*/),
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "Acc_ProjectParticipantsProject__r(first:200)"
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
                  (v6/*: any*/)
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
    "cacheID": "0cfa5163d79772b276c6e44ee4da0cca",
    "id": null,
    "metadata": {},
    "name": "ProjectSetupSpendProfileQuery",
    "operationKind": "query",
    "text": "query ProjectSetupSpendProfileQuery(\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...NewForecastTableFragment\n      ...PageFragment\n      query {\n        Acc_ProjectParticipant__c(where: {Id: {eq: $partnerId}}) {\n          edges {\n            node {\n              Id\n              Acc_SpendProfileCompleted__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment NewForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NumberofPeriods__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n            isAssociate\n            partnerRoles {\n              partnerId\n              isFc\n              isPm\n              isMo\n              isAssociate\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_ProjectParticipant: Acc_ProjectParticipant__c(where: {Id: {eq: $partnerId}}, first: 1) {\n      edges {\n        node {\n          Acc_ForecastLastModifiedDate__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimTotalProjectPeriods: Acc_Claims__c(where: {Acc_ProjectParticipant__c: {eq: $partnerId}, RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 200) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_FinalClaim__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {Acc_ProjectParticipant__c: {eq: $partnerId}, RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 2000) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileTotalProjectPeriod: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $partnerId}, RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, first: 100) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileTotalCostCategories: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $partnerId}, RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}, orderBy: {Acc_CostCategory__r: {Acc_DisplayOrder__c: {order: ASC}}}, first: 2000) {\n      edges {\n        node {\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Id\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileDetails: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $partnerId}, RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_InitialForecastCost__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Id\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r(first: 200) {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9ac5233858b11085f12420cc039e98cf";

export default node;
