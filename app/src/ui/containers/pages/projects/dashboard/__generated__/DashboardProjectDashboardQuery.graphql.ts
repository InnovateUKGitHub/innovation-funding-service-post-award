/**
 * @generated SignedSource<<a448e139ee9339e6f9678e48e06733c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DashboardProjectDashboardQuery$variables = Record<PropertyKey, never>;
export type DashboardProjectDashboardQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_BroadcastMessage__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Message__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Competition_type__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly DisplayValue: string | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimsOverdue__c: {
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
              readonly Acc_LeadParticipantID__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_LeadParticipantName__c: {
                readonly value: string | null | undefined;
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
                      readonly Id: string;
                      readonly Name: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly Acc_NewForecastNeeded__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_OpenClaimStatus__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantStatus__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_TrackingClaims__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly label: string | null | undefined;
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_StartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Project_Contact_Links__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_ProjectId__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_Role__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_StartDate__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
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
    };
  };
};
export type DashboardProjectDashboardQuery = {
  response: DashboardProjectDashboardQuery$data;
  variables: DashboardProjectDashboardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "literal": "TODAY"
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v4 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v5 = {
  "nulls": "LAST",
  "order": "DESC"
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
  "name": "isFc",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_StartDate__c",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v11 = [
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
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 100
                  },
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "and": [
                        {
                          "Acc_StartDate__c": {
                            "lte": (v0/*: any*/)
                          }
                        },
                        {
                          "Acc_EndDate__c": {
                            "gte": (v0/*: any*/)
                          }
                        }
                      ]
                    }
                  }
                ],
                "concreteType": "Acc_BroadcastMessage__cConnection",
                "kind": "LinkedField",
                "name": "Acc_BroadcastMessage__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_BroadcastMessage__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_BroadcastMessage__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_Message__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Competition_type__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "DisplayValue",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "Acc_BroadcastMessage__c(first:100,where:{\"and\":[{\"Acc_StartDate__c\":{\"lte\":{\"literal\":\"TODAY\"}}},{\"Acc_EndDate__c\":{\"gte\":{\"literal\":\"TODAY\"}}}]})"
              },
              {
                "alias": null,
                "args": [
                  (v4/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_ClaimsForReview__c": (v5/*: any*/),
                      "Acc_PCRsForReview__c": (v5/*: any*/),
                      "Acc_PCRsUnderQuery__c": (v5/*: any*/),
                      "Acc_ProjectTitle__c": {
                        "nulls": "LAST",
                        "order": "ASC"
                      }
                    }
                  }
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Ext_Project_Roles",
                            "kind": "LinkedField",
                            "name": "roles",
                            "plural": false,
                            "selections": [
                              (v6/*: any*/),
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isSalesforceSystemUser",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Partner_Roles",
                                "kind": "LinkedField",
                                "name": "partnerRoles",
                                "plural": true,
                                "selections": [
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v6/*: any*/),
                                  (v9/*: any*/),
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
                            "concreteType": "Ext_Project_Counts",
                            "kind": "LinkedField",
                            "name": "claimCounts",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "DRAFT",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "SUBMITTED",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "MO_QUERIED",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "AWAITING_IUK_APPROVAL",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "INNOVATE_QUERIED",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "AWAITING_IAR",
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
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_LeadParticipantName__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_LeadParticipantID__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_NumberofPeriods__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodNumber__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_EndDate__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_PCRsForReview__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_PCRsUnderQuery__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimsOverdue__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": [
                              (v1/*: any*/),
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
                            "name": "Acc_CurrentPeriodStartDate__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodEndDate__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              (v4/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "where",
                                "value": {
                                  "Acc_Role__c": {
                                    "eq": "Associate"
                                  }
                                }
                              }
                            ],
                            "concreteType": "Acc_ProjectContactLink__cConnection",
                            "kind": "LinkedField",
                            "name": "Project_Contact_Links__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_ProjectContactLink__cEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Acc_ProjectContactLink__c",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Role__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ProjectId__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      (v10/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "Project_Contact_Links__r(first:2000,where:{\"Acc_Role__c\":{\"eq\":\"Associate\"}})"
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 500
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
                                            "selections": (v2/*: any*/),
                                            "storageKey": null
                                          },
                                          (v3/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_AccountId__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      (v3/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "BooleanValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_NewForecastNeeded__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ParticipantStatus__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_TrackingClaims__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "StringValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_OpenClaimStatus__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "Acc_ProjectParticipantsProject__r(first:500)"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "Acc_Project__c(first:2000,orderBy:{\"Acc_ClaimsForReview__c\":{\"nulls\":\"LAST\",\"order\":\"DESC\"},\"Acc_PCRsForReview__c\":{\"nulls\":\"LAST\",\"order\":\"DESC\"},\"Acc_PCRsUnderQuery__c\":{\"nulls\":\"LAST\",\"order\":\"DESC\"},\"Acc_ProjectTitle__c\":{\"nulls\":\"LAST\",\"order\":\"ASC\"}})"
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DashboardProjectDashboardQuery",
    "selections": (v11/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DashboardProjectDashboardQuery",
    "selections": (v11/*: any*/)
  },
  "params": {
    "cacheID": "6309d4b06a34234491b984400086dbde",
    "id": null,
    "metadata": {},
    "name": "DashboardProjectDashboardQuery",
    "operationKind": "query",
    "text": "query DashboardProjectDashboardQuery {\n  salesforce {\n    uiapi {\n      query {\n        Acc_BroadcastMessage__c(first: 100, where: {and: [{Acc_StartDate__c: {lte: {literal: TODAY}}}, {Acc_EndDate__c: {gte: {literal: TODAY}}}]}) {\n          edges {\n            node {\n              Acc_Message__c {\n                value\n              }\n              Competition_type__c {\n                value\n              }\n              Id\n              DisplayValue\n            }\n          }\n        }\n        Acc_Project__c(first: 2000, orderBy: {Acc_ClaimsForReview__c: {nulls: LAST, order: DESC}, Acc_PCRsForReview__c: {nulls: LAST, order: DESC}, Acc_PCRsUnderQuery__c: {nulls: LAST, order: DESC}, Acc_ProjectTitle__c: {nulls: LAST, order: ASC}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                isSalesforceSystemUser\n                partnerRoles {\n                  isFc\n                  isPm\n                  isMo\n                  isAssociate\n                  partnerId\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_LeadParticipantName__c {\n                value\n              }\n              Acc_LeadParticipantID__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_StartDate__c {\n                value\n              }\n              Acc_EndDate__c {\n                value\n              }\n              Acc_ClaimsForReview__c {\n                value\n              }\n              Acc_PCRsForReview__c {\n                value\n              }\n              Acc_PCRsUnderQuery__c {\n                value\n              }\n              Acc_ClaimsOverdue__c {\n                value\n              }\n              Acc_ClaimsUnderQuery__c {\n                value\n              }\n              Acc_NumberOfOpenClaims__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n                label\n              }\n              Acc_CurrentPeriodStartDate__c {\n                value\n              }\n              Acc_CurrentPeriodEndDate__c {\n                value\n              }\n              Project_Contact_Links__r(where: {Acc_Role__c: {eq: \"Associate\"}}, first: 2000) {\n                edges {\n                  node {\n                    Acc_Role__c {\n                      value\n                    }\n                    Acc_ProjectId__c {\n                      value\n                    }\n                    Acc_StartDate__c {\n                      value\n                    }\n                  }\n                }\n              }\n              Acc_ProjectParticipantsProject__r(first: 500) {\n                edges {\n                  node {\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                      Id\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                    Id\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_TrackingClaims__c {\n                      value\n                    }\n                    Acc_OpenClaimStatus__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d193f0f0d1b2306a113a68d3ac0c92b";

export default node;
