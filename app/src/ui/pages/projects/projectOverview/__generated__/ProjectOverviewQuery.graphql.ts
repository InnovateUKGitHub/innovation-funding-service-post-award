/**
 * @generated SignedSource<<815a1a79acd5e1591e463b1f5d127201>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectOverviewQuery$variables = {
  projectId: string;
};
export type ProjectOverviewQuery$data = {
  readonly currentUser: {
    readonly email: string | null | undefined;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimsForReview__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodStartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_EndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_GOLTotalCostAwarded__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_PCRsForReview__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_PCRsUnderQuery__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
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
                    readonly Acc_NewForecastNeeded__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantStatus__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ProjectRole__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_TotalApprovedCosts__c: {
                      readonly value: number | null | undefined;
                    } | null | undefined;
                    readonly Acc_TotalParticipantCosts__c: {
                      readonly value: number | null | undefined;
                    } | null | undefined;
                    readonly Acc_TrackingClaims__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_TotalProjectCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly claimCounts: {
                readonly SUBMITTED: number;
              };
              readonly isActive: boolean;
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly isSalesforceSystemUser: boolean;
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
      readonly " $fragmentSpreads": FragmentRefs<"PageFragment" | "ProjectSuspensionMessageFragment">;
    };
  };
};
export type ProjectOverviewQuery = {
  response: ProjectOverviewQuery$data;
  variables: ProjectOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrentUserObject",
  "kind": "LinkedField",
  "name": "currentUser",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v2 = {
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isActive",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "partnerId",
  "storageKey": null
},
v11 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectNumber__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectTitle__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectStatus__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ParticipantStatus__c",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": [
    (v2/*: any*/)
  ],
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
            (v3/*: any*/),
            (v4/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Ext_Project_Roles",
              "kind": "LinkedField",
              "name": "roles",
              "plural": false,
              "selections": [
                (v5/*: any*/),
                (v6/*: any*/),
                (v7/*: any*/),
                (v8/*: any*/),
                (v9/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Ext_Partner_Roles",
                  "kind": "LinkedField",
                  "name": "partnerRoles",
                  "plural": true,
                  "selections": [
                    (v6/*: any*/),
                    (v5/*: any*/),
                    (v7/*: any*/),
                    (v8/*: any*/),
                    (v10/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Ext_Project_Counts",
              "kind": "LinkedField",
              "name": "claimCounts",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "SUBMITTED",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            (v12/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
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
              "name": "Acc_NumberofPeriods__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_EndDate__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentPeriodStartDate__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_CurrentPeriodEndDate__c",
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
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalProjectCosts__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_CompetitionType__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_PCRsUnderQuery__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_PCRsForReview__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_ClaimsForReview__c",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "first",
                  "value": 500
                },
                {
                  "kind": "Literal",
                  "name": "orderBy",
                  "value": {
                    "Acc_AccountId__r": {
                      "Name": {
                        "order": "ASC"
                      }
                    }
                  }
                }
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
                        (v3/*: any*/),
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
                              "selections": (v11/*: any*/),
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
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        (v15/*: any*/),
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
                          "name": "Acc_TotalApprovedCosts__c",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BooleanValue",
                          "kind": "LinkedField",
                          "name": "Acc_NewForecastNeeded__c",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PicklistValue",
                          "kind": "LinkedField",
                          "name": "Acc_TrackingClaims__c",
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
              "storageKey": "Acc_ProjectParticipantsProject__r(first:500,orderBy:{\"Acc_AccountId__r\":{\"Name\":{\"order\":\"ASC\"}}})"
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
v17 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v2/*: any*/)
],
v18 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 200
    }
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
            (v3/*: any*/),
            (v15/*: any*/),
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
  "storageKey": "Acc_ProjectParticipantsProject__r(first:200)"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectOverviewQuery",
    "selections": [
      (v1/*: any*/),
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
                  (v16/*: any*/)
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
    "name": "ProjectOverviewQuery",
    "selections": [
      (v1/*: any*/),
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
                    "args": (v17/*: any*/),
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
                              (v3/*: any*/),
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
                                  (v6/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v9/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v5/*: any*/),
                                      (v6/*: any*/),
                                      (v7/*: any*/),
                                      (v8/*: any*/),
                                      (v9/*: any*/),
                                      (v10/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v18/*: any*/)
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
                    "args": (v17/*: any*/),
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
                              (v3/*: any*/),
                              (v14/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v7/*: any*/),
                                  (v6/*: any*/),
                                  (v5/*: any*/),
                                  (v8/*: any*/),
                                  (v9/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v6/*: any*/),
                                      (v5/*: any*/),
                                      (v7/*: any*/),
                                      (v9/*: any*/),
                                      (v8/*: any*/),
                                      (v10/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v18/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v16/*: any*/)
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
    "cacheID": "8025390e72c9aaf98e25c3146a464a47",
    "id": null,
    "metadata": {},
    "name": "ProjectOverviewQuery",
    "operationKind": "query",
    "text": "query ProjectOverviewQuery(\n  $projectId: ID!\n) {\n  currentUser {\n    email\n  }\n  salesforce {\n    uiapi {\n      ...PageFragment\n      ...ProjectSuspensionMessageFragment\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                isSalesforceSystemUser\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  isAssociate\n                  partnerId\n                }\n              }\n              claimCounts {\n                SUBMITTED\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_EndDate__c {\n                value\n              }\n              Acc_CurrentPeriodStartDate__c {\n                value\n              }\n              Acc_CurrentPeriodEndDate__c {\n                value\n              }\n              Acc_GOLTotalCostAwarded__c {\n                value\n              }\n              Acc_TotalProjectCosts__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_PCRsUnderQuery__c {\n                value\n              }\n              Acc_PCRsForReview__c {\n                value\n              }\n              Acc_ClaimsForReview__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(orderBy: {Acc_AccountId__r: {Name: {order: ASC}}}, first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                    Acc_TotalParticipantCosts__c {\n                      value\n                    }\n                    Acc_TotalApprovedCosts__c {\n                      value\n                    }\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_TrackingClaims__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r(first: 200) {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectSuspensionMessageFragment on UIAPI {\n  query {\n    ProjectSuspensionProject: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_ProjectStatus__c {\n            value\n          }\n          roles {\n            isPm\n            isFc\n            isMo\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isFc\n              isMo\n              isPm\n              isSalesforceSystemUser\n              isAssociate\n              partnerId\n            }\n          }\n          Acc_ProjectParticipantsProject__r(first: 200) {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "45851ac33a418048c5af4e37d982e705";

export default node;
