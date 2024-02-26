/**
 * @generated SignedSource<<a2f802e5585ebb070b8664b96503e812>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CompaniesHouseSearchQuery$variables = {
  searchQuery: string;
};
export type CompaniesHouseSearchQuery$data = {
  readonly companies: ReadonlyArray<{
    readonly addressFull: string | null | undefined;
    readonly registrationNumber: string;
    readonly title: string;
  }>;
};
export type CompaniesHouseSearchQuery = {
  response: CompaniesHouseSearchQuery$data;
  variables: CompaniesHouseSearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchQuery"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "itemsPerPage",
        "value": 10
      },
      {
        "kind": "Variable",
        "name": "query",
        "variableName": "searchQuery"
      }
    ],
    "concreteType": "CompaniesHouseObject",
    "kind": "LinkedField",
    "name": "companies",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "registrationNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "addressFull",
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
    "name": "CompaniesHouseSearchQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CompaniesHouseSearchQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cb95f976509835e72a5becd7a10029ea",
    "id": null,
    "metadata": {},
    "name": "CompaniesHouseSearchQuery",
    "operationKind": "query",
    "text": "query CompaniesHouseSearchQuery(\n  $searchQuery: String!\n) {\n  companies(query: $searchQuery, itemsPerPage: 10) {\n    registrationNumber\n    title\n    addressFull\n  }\n}\n"
  }
};
})();

(node as any).hash = "9ee00e0d23ac74a58b747d9cb094a07a";

export default node;
