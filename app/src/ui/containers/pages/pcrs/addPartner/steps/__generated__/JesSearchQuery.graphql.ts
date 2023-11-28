/**
 * @generated SignedSource<<d8c613f31c6e5b050479bf514fbaf774>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type JesSearchQuery$variables = {
  search: string;
};
export type JesSearchQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Account: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Id: string;
              readonly JES_Organisation__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Name: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type JesSearchQuery = {
  response: JesSearchQuery$data;
  variables: JesSearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
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
                    "kind": "Literal",
                    "name": "first",
                    "value": 1000
                  },
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "kind": "Literal",
                            "name": "and.0",
                            "value": {
                              "JES_Organisation__c": {
                                "eq": "Yes"
                              }
                            }
                          },
                          {
                            "fields": [
                              {
                                "fields": [
                                  {
                                    "kind": "Variable",
                                    "name": "like",
                                    "variableName": "search"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "Name"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.1"
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
                "concreteType": "AccountConnection",
                "kind": "LinkedField",
                "name": "Account",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Account",
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
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Name",
                            "plural": false,
                            "selections": (v1/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "JES_Organisation__c",
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
    "name": "JesSearchQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "JesSearchQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9708f63f4bbcada12c486759d43b21b9",
    "id": null,
    "metadata": {},
    "name": "JesSearchQuery",
    "operationKind": "query",
    "text": "query JesSearchQuery(\n  $search: String!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Account(where: {and: [{JES_Organisation__c: {eq: \"Yes\"}}, {Name: {like: $search}}]}, first: 1000) {\n          edges {\n            node {\n              Id\n              Name {\n                value\n              }\n              JES_Organisation__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "392c3635dfd2380e2c8efd8d0560a7a1";

export default node;
