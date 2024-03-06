/**
 * @generated SignedSource<<8af7a74d501d45310d87914ca5d4b902>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ViewForecastQuery$variables = {
  partnerId: string;
  projectId: string;
  projectIdStr: string;
};
export type ViewForecastQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Claims__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_PaidDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null | undefined;
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
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipantsProject__r: {
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
                    readonly Acc_ForecastLastModifiedDate__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_NewForecastNeeded__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_OverheadRate__c: {
                      readonly value: number | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantStatus__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ProjectRole__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
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
      readonly " $fragmentSpreads": FragmentRefs<"ForecastWarningFragment" | "ProjectSuspensionMessageFragment" | "TitleFragment">;
    };
  };
};
export type ViewForecastQuery = {
  response: ViewForecastQuery$data;
  variables: ViewForecastQuery$variables;
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
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectIdStr"
},
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v4 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v5 = [
  {
    "fields": (v4/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectParticipant__c"
  }
],
v6 = [
  (v3/*: any*/),
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
            "fields": (v5/*: any*/),
            "kind": "ObjectValue",
            "name": "and.1"
          },
          {
            "kind": "Literal",
            "name": "and.2",
            "value": {
              "RecordType": {
                "DeveloperName": {
                  "eq": "Total_Project_Period"
                }
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
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ClaimStatus__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v11 = {
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
      "selections": (v8/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": (v6/*: any*/),
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
            (v7/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_FinalClaim__c",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_PaidDate__c",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            (v11/*: any*/)
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
},
v14 = [
  (v13/*: any*/)
],
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "Ext_Project_Roles",
  "kind": "LinkedField",
  "name": "roles",
  "plural": false,
  "selections": [
    (v15/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Ext_Partner_Roles",
      "kind": "LinkedField",
      "name": "partnerRoles",
      "plural": true,
      "selections": [
        (v16/*: any*/),
        (v15/*: any*/),
        (v17/*: any*/),
        (v18/*: any*/),
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
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectStatus__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v21 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 500
  },
  {
    "fields": [
      {
        "fields": (v4/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ParticipantStatus__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_AccountId__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": (v14/*: any*/),
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
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isActive",
              "storageKey": null
            },
            (v19/*: any*/),
            (v20/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentPeriodNumber__c",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": (v21/*: any*/),
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
                        (v7/*: any*/),
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
                              "selections": (v8/*: any*/),
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        (v22/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PicklistValue",
                          "kind": "LinkedField",
                          "name": "Acc_ProjectRole__c",
                          "plural": false,
                          "selections": (v8/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BooleanValue",
                          "kind": "LinkedField",
                          "name": "Acc_NewForecastNeeded__c",
                          "plural": false,
                          "selections": (v8/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PercentValue",
                          "kind": "LinkedField",
                          "name": "Acc_OverheadRate__c",
                          "plural": false,
                          "selections": (v8/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "DateTimeValue",
                          "kind": "LinkedField",
                          "name": "Acc_ForecastLastModifiedDate__c",
                          "plural": false,
                          "selections": (v8/*: any*/),
                          "storageKey": null
                        },
                        (v23/*: any*/)
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
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v26 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v13/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewForecastQuery",
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
                "name": "ForecastWarningFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TitleFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ProjectSuspensionMessageFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v12/*: any*/),
                  (v24/*: any*/)
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
    "name": "ViewForecastQuery",
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
                    "alias": "ForecastWarning_Profile",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 1000
                      },
                      {
                        "fields": [
                          {
                            "items": [
                              {
                                "fields": (v5/*: any*/),
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
                                          "eq": "Profile_Detail"
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
                              },
                              {
                                "kind": "Literal",
                                "name": "and.2",
                                "value": {
                                  "Acc_CostCategory__c": {
                                    "ne": null
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
                              (v7/*: any*/),
                              (v25/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategoryGOLCost__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_LatestForecastCost__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              (v11/*: any*/)
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
                    "alias": "ForecastWarning_CostCategory",
                    "args": [
                      (v3/*: any*/)
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
                              (v7/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategoryName__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Acc_DisplayOrder__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
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
                  {
                    "alias": "ForecastWarning_Claims",
                    "args": (v6/*: any*/),
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
                              (v7/*: any*/),
                              (v10/*: any*/),
                              (v25/*: any*/),
                              (v9/*: any*/),
                              (v11/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_PeriodCostCategoryTotal__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
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
                    "alias": "ForecastWarning_Project",
                    "args": (v14/*: any*/),
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
                              (v7/*: any*/),
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": (v21/*: any*/),
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
                                          (v7/*: any*/),
                                          (v23/*: any*/)
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
                    "alias": "Title_Project",
                    "args": (v26/*: any*/),
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
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectNumber__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
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
                    "alias": "ProjectSuspensionProject",
                    "args": (v26/*: any*/),
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
                              (v7/*: any*/),
                              (v20/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v17/*: any*/),
                                  (v16/*: any*/),
                                  (v15/*: any*/),
                                  (v18/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isSalesforceSystemUser",
                                    "storageKey": null
                                  }
                                ],
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
                                          (v7/*: any*/),
                                          (v22/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
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
                  (v12/*: any*/),
                  (v24/*: any*/)
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
    "cacheID": "89aead6b72e23c5dfa70209df5c716ce",
    "id": null,
    "metadata": {},
    "name": "ViewForecastQuery",
    "operationKind": "query",
    "text": "query ViewForecastQuery(\n  $projectIdStr: String!\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...ForecastWarningFragment\n      ...TitleFragment\n      ...ProjectSuspensionMessageFragment\n      query {\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  isAssociate\n                  partnerId\n                }\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_OverheadRate__c {\n                      value\n                    }\n                    Acc_ForecastLastModifiedDate__c {\n                      value\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastWarningFragment on UIAPI {\n  query {\n    ForecastWarning_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 1000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastWarning_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastWarning_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastWarning_Project: Acc_Project__c(where: {Id: {eq: $projectId}}) {\n      edges {\n        node {\n          Id\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            partnerRoles {\n              isFc\n              isMo\n              isPm\n              isAssociate\n              partnerId\n            }\n          }\n          Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n            edges {\n              node {\n                Id\n                Acc_AccountId__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectSuspensionMessageFragment on UIAPI {\n  query {\n    ProjectSuspensionProject: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_ProjectStatus__c {\n            value\n          }\n          roles {\n            isPm\n            isFc\n            isMo\n            isAssociate\n            isSalesforceSystemUser\n          }\n          Acc_ProjectParticipantsProject__r {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5766a72e94e8e2b9db31d58cce92fbbe";

export default node;
