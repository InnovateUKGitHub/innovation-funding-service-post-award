/**
 * @generated SignedSource<<9f9139f01188020ff5c88904f6eda61a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BroadcastDetailsQuery$variables = {
  broadcastId: string;
};
export type BroadcastDetailsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_BroadcastMessage__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_EndDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_Message__c: {
                readonly value: any | null;
              } | null;
              readonly Acc_StartDate__c: {
                readonly value: string | null;
              } | null;
              readonly DisplayValue: string | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type BroadcastDetailsQuery = {
  response: BroadcastDetailsQuery$data;
  variables: BroadcastDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "broadcastId"
  }
],
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
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "eq",
                            "variableName": "broadcastId"
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
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_StartDate__c",
                            "plural": false,
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_EndDate__c",
                            "plural": false,
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_Message__c",
                            "plural": false,
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          },
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BroadcastDetailsQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BroadcastDetailsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7013eda07ff9ae4a6c104d3eb10a750e",
    "id": null,
    "metadata": {},
    "name": "BroadcastDetailsQuery",
    "operationKind": "query",
    "text": "query BroadcastDetailsQuery(\n  $broadcastId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_BroadcastMessage__c(where: {Id: {eq: $broadcastId}}) {\n          edges {\n            node {\n              Acc_StartDate__c {\n                value\n              }\n              Acc_EndDate__c {\n                value\n              }\n              Acc_Message__c {\n                value\n              }\n              Id\n              DisplayValue\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e679ac1718b452df5a7a960bcf9a2f32";

export default node;
