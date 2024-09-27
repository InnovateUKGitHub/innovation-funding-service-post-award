/**
 * @generated SignedSource<<342477359a99595482622af84cc32ea1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ClaimDrawdownTableQuery$variables = {
  periodId: number;
  projectId: string;
};
export type ClaimDrawdownTableQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Prepayment__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_GranttobePaid__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_PeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipant__r: {
                readonly Acc_TotalGrantApproved__c: {
                  readonly value: number | null | undefined;
                } | null | undefined;
                readonly Acc_TotalParticipantCosts__c: {
                  readonly value: number | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Loan_DrawdownStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Loan_LatestForecastDrawdown__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Loan_PlannedDateForDrawdown__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type ClaimDrawdownTableQuery = {
  response: ClaimDrawdownTableQuery$data;
  variables: ClaimDrawdownTableQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "periodId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v3 = [
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
                    "value": 1
                  },
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
                        "name": "Acc_PeriodNumber__c"
                      },
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
                            "name": "Acc_ProjectId__c"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "Acc_ProjectParticipant__r"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_Prepayment__cConnection",
                "kind": "LinkedField",
                "name": "Acc_Prepayment__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_Prepayment__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Prepayment__c",
                        "kind": "LinkedField",
                        "name": "node",
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
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_PeriodNumber__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Loan_DrawdownStatus__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Loan_LatestForecastDrawdown__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Loan_PlannedDateForDrawdown__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_GranttobePaid__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_TotalParticipantCosts__c",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CurrencyValue",
                                "kind": "LinkedField",
                                "name": "Acc_TotalGrantApproved__c",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimDrawdownTableQuery",
    "selections": (v3/*: any*/),
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
    "name": "ClaimDrawdownTableQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "1c295eae37a0befa30b80c39ddb0502e",
    "id": null,
    "metadata": {},
    "name": "ClaimDrawdownTableQuery",
    "operationKind": "query",
    "text": "query ClaimDrawdownTableQuery(\n  $projectId: ID!\n  $periodId: Double!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Prepayment__c(where: {Acc_ProjectParticipant__r: {Acc_ProjectId__c: {eq: $projectId}}, Acc_PeriodNumber__c: {eq: $periodId}}, first: 1) {\n          edges {\n            node {\n              Id\n              Acc_PeriodNumber__c {\n                value\n              }\n              Loan_DrawdownStatus__c {\n                value\n              }\n              Loan_LatestForecastDrawdown__c {\n                value\n              }\n              Loan_PlannedDateForDrawdown__c {\n                value\n              }\n              Acc_GranttobePaid__c {\n                value\n              }\n              Acc_ProjectParticipant__r {\n                Acc_TotalParticipantCosts__c {\n                  value\n                }\n                Acc_TotalGrantApproved__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "743f81f3bc666c5e1dbad2d3a362e45b";

export default node;
