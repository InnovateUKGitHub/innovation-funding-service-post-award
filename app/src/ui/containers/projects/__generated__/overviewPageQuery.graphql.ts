/**
 * @generated SignedSource<<7e7d5fed476f598a326fea6435da103d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type overviewPageQuery$variables = {};
export type overviewPageQuery$data = {
  readonly currentUser: {
    readonly email: string | null;
  };
  readonly uiapi: {
    readonly query: {
      readonly Acc_Project__c: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly Acc_CurrentPeriodNumber__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_EndDate__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_NumberofPeriods__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_ProjectNumber__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_ProjectParticipantsProject__r: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly Name: {
                    readonly value: string | null;
                  } | null;
                } | null;
              } | null> | null;
            } | null;
            readonly Acc_ProjectTitle__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_StartDate__c: {
              readonly value: string | null;
            } | null;
            readonly Name: {
              readonly value: string | null;
            } | null;
          } | null;
        } | null> | null;
      } | null;
    };
  };
};
export type overviewPageQuery = {
  response: overviewPageQuery$data;
  variables: overviewPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v0/*: any*/),
  "storageKey": null
},
v2 = [
  {
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
                "name": "where",
                "value": {
                  "Id": {
                    "eq": "a0E2600000kSMxMEAW"
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
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StringValue",
                        "kind": "LinkedField",
                        "name": "Acc_ProjectNumber__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StringValue",
                        "kind": "LinkedField",
                        "name": "Acc_ProjectTitle__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DoubleValue",
                        "kind": "LinkedField",
                        "name": "Acc_CurrentPeriodNumber__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DoubleValue",
                        "kind": "LinkedField",
                        "name": "Acc_NumberofPeriods__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "kind": "LinkedField",
                        "name": "Acc_StartDate__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "kind": "LinkedField",
                        "name": "Acc_EndDate__c",
                        "plural": false,
                        "selections": (v0/*: any*/),
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
                                  (v1/*: any*/)
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
            "storageKey": "Acc_Project__c(where:{\"Id\":{\"eq\":\"a0E2600000kSMxMEAW\"}})"
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
    "name": "overviewPageQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "overviewPageQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e43fe3388de9d4c6954b748317444835",
    "id": null,
    "metadata": {},
    "name": "overviewPageQuery",
    "operationKind": "query",
    "text": "query overviewPageQuery {\n  currentUser {\n    email\n  }\n  uiapi {\n    query {\n      Acc_Project__c(where: {Id: {eq: \"a0E2600000kSMxMEAW\"}}) {\n        edges {\n          node {\n            Name {\n              value\n            }\n            Acc_ProjectNumber__c {\n              value\n            }\n            Acc_ProjectTitle__c {\n              value\n            }\n            Acc_CurrentPeriodNumber__c {\n              value\n            }\n            Acc_NumberofPeriods__c {\n              value\n            }\n            Acc_StartDate__c {\n              value\n            }\n            Acc_EndDate__c {\n              value\n            }\n            Acc_ProjectParticipantsProject__r {\n              edges {\n                node {\n                  Name {\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d36c7dd6c17c9d2553043674bedd77ed";

export default node;
