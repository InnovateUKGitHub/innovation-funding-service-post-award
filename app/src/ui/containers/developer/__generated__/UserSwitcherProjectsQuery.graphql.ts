/**
 * @generated SignedSource<<881f3ff90ab4162f63433b18334f0f4f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserSwitcherProjectsQuery$variables = {};
export type UserSwitcherProjectsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionId__r: {
                readonly Acc_CompetitionType__c: {
                  readonly displayValue: string | null;
                } | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type UserSwitcherProjectsQuery = {
  response: UserSwitcherProjectsQuery$data;
  variables: UserSwitcherProjectsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "order": "ASC"
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "login",
        "value": "system"
      }
    ],
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
                    "value": 2000
                  },
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_CompetitionId__r": {
                        "Acc_CompetitionType__c": (v0/*: any*/)
                      },
                      "Acc_ProjectNumber__c": (v0/*: any*/)
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
                            "concreteType": "Competition__c",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionId__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_CompetitionType__c",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "displayValue",
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
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "Acc_Project__c(first:2000,orderBy:{\"Acc_CompetitionId__r\":{\"Acc_CompetitionType__c\":{\"order\":\"ASC\"}},\"Acc_ProjectNumber__c\":{\"order\":\"ASC\"}})"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "salesforce(login:\"system\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserSwitcherProjectsQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserSwitcherProjectsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c71ed86eb76285c9be1c5f81154cf7f4",
    "id": null,
    "metadata": {},
    "name": "UserSwitcherProjectsQuery",
    "operationKind": "query",
    "text": "query UserSwitcherProjectsQuery {\n  salesforce(login: \"system\") {\n    uiapi {\n      query {\n        Acc_Project__c(orderBy: {Acc_CompetitionId__r: {Acc_CompetitionType__c: {order: ASC}}, Acc_ProjectNumber__c: {order: ASC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CompetitionId__r {\n                Acc_CompetitionType__c {\n                  displayValue\n                }\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ba98b493631ff0f65b3afe1a84f4bddd";

export default node;
