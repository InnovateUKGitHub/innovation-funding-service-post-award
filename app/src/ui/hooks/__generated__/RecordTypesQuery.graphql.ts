/**
 * @generated SignedSource<<8263787eb9dd0f65792a0ea14bbec3a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RecordTypesQuery$variables = Record<PropertyKey, never>;
export type RecordTypesQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly RecordType: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Id: string;
              readonly Name: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly SobjectType: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type RecordTypesQuery = {
  response: RecordTypesQuery$data;
  variables: RecordTypesQuery$variables;
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
v1 = [
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
                "args": null,
                "concreteType": "RecordTypeConnection",
                "kind": "LinkedField",
                "name": "RecordType",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "RecordTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "RecordType",
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
                            "selections": (v0/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "SobjectType",
                            "plural": false,
                            "selections": (v0/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RecordTypesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RecordTypesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ad393b24e16d17071fc0e757237d0b41",
    "id": null,
    "metadata": {},
    "name": "RecordTypesQuery",
    "operationKind": "query",
    "text": "query RecordTypesQuery {\n  salesforce {\n    uiapi {\n      query {\n        RecordType {\n          edges {\n            node {\n              Id\n              Name {\n                value\n              }\n              SobjectType {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2fe306db004d78c363068a12ed69cf55";

export default node;
