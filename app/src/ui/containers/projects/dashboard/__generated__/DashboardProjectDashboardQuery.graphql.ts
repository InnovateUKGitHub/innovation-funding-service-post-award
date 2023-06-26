/**
 * @generated SignedSource<<72fc8aa47060c04ddeedc884e0d79d7a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DashboardProjectDashboardQuery$variables = {};
export type DashboardProjectDashboardQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_BroadcastMessage__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Message__c: {
                readonly value: any | null;
              } | null;
              readonly DisplayValue: string | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimsForReview__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ClaimsOverdue__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ClaimsUnderQuery__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_CurrentPeriodEndDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_CurrentPeriodStartDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_EndDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_LeadParticipantID__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_LeadParticipantName__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_NumberOfOpenClaims__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_PCRsForReview__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_PCRsUnderQuery__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectParticipantsProject__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_AccountId__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_AccountId__r: {
                      readonly Id: string;
                      readonly Name: {
                        readonly value: string | null;
                      } | null;
                    } | null;
                    readonly Acc_NewForecastNeeded__c: {
                      readonly value: boolean | null;
                    } | null;
                    readonly Acc_OpenClaimStatus__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_ParticipantStatus__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_TrackingClaims__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Id: string;
                  } | null;
                } | null> | null;
              } | null;
              readonly Acc_ProjectStatus__c: {
                readonly label: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_StartDate__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly isSalesforceSystemUser: boolean;
                readonly partnerRoles: ReadonlyArray<{
                  readonly isFc: boolean;
                  readonly isMo: boolean;
                  readonly isPm: boolean;
                  readonly partnerId: string;
                }>;
              };
            } | null;
          } | null> | null;
        } | null;
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
  "nulls": "LAST",
  "order": "DESC"
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
v8 = [
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
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 2000
                  },
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_ClaimsForReview__c": (v4/*: any*/),
                      "Acc_PCRsForReview__c": (v4/*: any*/),
                      "Acc_PCRsUnderQuery__c": (v4/*: any*/),
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
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v7/*: any*/),
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
                                  (v6/*: any*/),
                                  (v7/*: any*/),
                                  (v5/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_StartDate__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
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
                            "name": "Acc_ClaimsForReview__c",
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
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimsUnderQuery__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_NumberOfOpenClaims__c",
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
    "selections": (v8/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DashboardProjectDashboardQuery",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "c30df57d651f23e01b15d1cc2a3cd3e9",
    "id": null,
    "metadata": {},
    "name": "DashboardProjectDashboardQuery",
    "operationKind": "query",
    "text": "query DashboardProjectDashboardQuery {\n  salesforce {\n    uiapi {\n      query {\n        Acc_BroadcastMessage__c(first: 100, where: {and: [{Acc_StartDate__c: {lte: {literal: TODAY}}}, {Acc_EndDate__c: {gte: {literal: TODAY}}}]}) {\n          edges {\n            node {\n              Acc_Message__c {\n                value\n              }\n              Id\n              DisplayValue\n            }\n          }\n        }\n        Acc_Project__c(first: 2000, orderBy: {Acc_ClaimsForReview__c: {nulls: LAST, order: DESC}, Acc_PCRsForReview__c: {nulls: LAST, order: DESC}, Acc_PCRsUnderQuery__c: {nulls: LAST, order: DESC}, Acc_ProjectTitle__c: {nulls: LAST, order: ASC}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n                isSalesforceSystemUser\n                partnerRoles {\n                  isFc\n                  isPm\n                  isMo\n                  partnerId\n                }\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_LeadParticipantName__c {\n                value\n              }\n              Acc_LeadParticipantID__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_StartDate__c {\n                value\n              }\n              Acc_EndDate__c {\n                value\n              }\n              Acc_ClaimsForReview__c {\n                value\n              }\n              Acc_PCRsForReview__c {\n                value\n              }\n              Acc_PCRsUnderQuery__c {\n                value\n              }\n              Acc_ClaimsOverdue__c {\n                value\n              }\n              Acc_ClaimsUnderQuery__c {\n                value\n              }\n              Acc_NumberOfOpenClaims__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n                label\n              }\n              Acc_CurrentPeriodStartDate__c {\n                value\n              }\n              Acc_CurrentPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(first: 500) {\n                edges {\n                  node {\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                      Id\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                    Id\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_TrackingClaims__c {\n                      value\n                    }\n                    Acc_OpenClaimStatus__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  clientConfig {\n    ifsRoot\n    ssoEnabled\n    options {\n      numberOfProjectsToSearch\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c2fb3c91d176e7fcf6736bc90ea8fe4e";

export default node;
