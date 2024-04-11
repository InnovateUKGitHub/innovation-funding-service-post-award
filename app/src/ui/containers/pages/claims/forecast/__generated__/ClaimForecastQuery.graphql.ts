/**
 * @generated SignedSource<<8c70b223079960383394eec1df79abb4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClaimForecastQuery$variables = {
  projectId: string;
  projectParticipantId: string;
};
export type ClaimForecastQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ForecastLastModifiedDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_OverheadRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"NewForecastTableFragment" | "PageFragment">;
    };
  };
};
export type ClaimForecastQuery = {
  response: ClaimForecastQuery$data;
  variables: ClaimForecastQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectParticipantId"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v2 = [
  (v1/*: any*/),
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
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v8 = [
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
            "selections": (v3/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
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
v9 = {
  "alias": null,
  "args": (v2/*: any*/),
  "concreteType": "Acc_Project__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Project__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v10 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectParticipantId"
  }
],
v11 = [
  (v1/*: any*/),
  {
    "fields": [
      {
        "fields": (v10/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v12 = [
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
            "selections": (v3/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PercentValue",
            "kind": "LinkedField",
            "name": "Acc_OverheadRate__c",
            "plural": false,
            "selections": (v3/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v13 = {
  "alias": null,
  "args": (v11/*: any*/),
  "concreteType": "Acc_ProjectParticipant__cConnection",
  "kind": "LinkedField",
  "name": "Acc_ProjectParticipant__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
},
v16 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v17 = {
  "order": "ASC"
},
v18 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "Acc_ProjectPeriodNumber__c": (v17/*: any*/)
  }
},
v19 = {
  "fields": (v10/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_ProjectParticipant__c"
},
v20 = {
  "fields": [
    (v19/*: any*/),
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
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v24 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimForecastQuery",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "NewForecastTableFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  (v13/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClaimForecastQuery",
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
                    "args": (v2/*: any*/),
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
                              (v14/*: any*/),
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
                                  (v6/*: any*/),
                                  (v4/*: any*/),
                                  (v5/*: any*/),
                                  (v7/*: any*/),
                                  (v15/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v6/*: any*/),
                                      (v4/*: any*/),
                                      (v5/*: any*/),
                                      (v7/*: any*/),
                                      (v15/*: any*/),
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
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectStatus__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
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
                                          (v14/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v3/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v3/*: any*/),
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
                    "alias": "ForecastTable_Project",
                    "args": (v2/*: any*/),
                    "concreteType": "Acc_Project__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_Project__c",
                    "plural": false,
                    "selections": (v8/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": "ForecastTable_ProjectParticipant",
                    "args": (v11/*: any*/),
                    "concreteType": "Acc_ProjectParticipant__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_ProjectParticipant__c",
                    "plural": false,
                    "selections": (v12/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": "ForecastTable_ClaimTotalProjectPeriods",
                    "args": [
                      (v16/*: any*/),
                      (v18/*: any*/),
                      (v20/*: any*/)
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
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_IAR_Status__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_IARRequired__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ClaimStatus__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              (v22/*: any*/),
                              (v23/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_FinalClaim__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
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
                      (v24/*: any*/),
                      (v18/*: any*/),
                      {
                        "fields": [
                          (v19/*: any*/),
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
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_PeriodCostCategoryTotal__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "IDValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategory__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
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
                      (v16/*: any*/),
                      (v20/*: any*/)
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
                              (v21/*: any*/),
                              (v22/*: any*/),
                              (v23/*: any*/)
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
                      (v16/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "orderBy",
                        "value": {
                          "Acc_CostCategory__r": {
                            "Acc_DisplayOrder__c": (v17/*: any*/)
                          }
                        }
                      },
                      {
                        "fields": [
                          (v19/*: any*/),
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
                                "selections": (v3/*: any*/),
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
                                  (v14/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "StringValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_CostCategoryName__c",
                                    "plural": false,
                                    "selections": (v3/*: any*/),
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
                      (v24/*: any*/),
                      (v18/*: any*/),
                      {
                        "fields": [
                          (v19/*: any*/),
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
                              (v14/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_InitialForecastCost__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_LatestForecastCost__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              (v21/*: any*/),
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
                  (v9/*: any*/),
                  (v13/*: any*/)
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
    "cacheID": "483cb7d8ae2232b9b5f28e663016e168",
    "id": null,
    "metadata": {},
    "name": "ClaimForecastQuery",
    "operationKind": "query",
    "text": "query ClaimForecastQuery(\n  $projectId: ID!\n  $projectParticipantId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...PageFragment\n      ...NewForecastTableFragment\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Acc_NumberofPeriods__c {\n                value\n              }\n              roles {\n                isFc\n                isPm\n                isMo\n                isAssociate\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {Id: {eq: $projectParticipantId}}, first: 1) {\n          edges {\n            node {\n              Acc_ForecastLastModifiedDate__c {\n                value\n              }\n              Acc_OverheadRate__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment NewForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NumberofPeriods__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n            isAssociate\n          }\n        }\n      }\n    }\n    ForecastTable_ProjectParticipant: Acc_ProjectParticipant__c(where: {Id: {eq: $projectParticipantId}}, first: 1) {\n      edges {\n        node {\n          Acc_ForecastLastModifiedDate__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimTotalProjectPeriods: Acc_Claims__c(where: {Acc_ProjectParticipant__c: {eq: $projectParticipantId}, RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 100) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_FinalClaim__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {Acc_ProjectParticipant__c: {eq: $projectParticipantId}, RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 2000) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileTotalProjectPeriod: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $projectParticipantId}, RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, first: 100) {\n      edges {\n        node {\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileTotalCostCategories: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $projectParticipantId}, RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}, orderBy: {Acc_CostCategory__r: {Acc_DisplayOrder__c: {order: ASC}}}, first: 100) {\n      edges {\n        node {\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Id\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_ProfileDetails: Acc_Profile__c(where: {Acc_ProjectParticipant__c: {eq: $projectParticipantId}, RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, orderBy: {Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_InitialForecastCost__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Id\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "db0856938afb0d176d8a2727e3c45f9d";

export default node;
