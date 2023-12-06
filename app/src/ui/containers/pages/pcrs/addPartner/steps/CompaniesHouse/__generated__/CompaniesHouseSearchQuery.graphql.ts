/**
 * @generated SignedSource<<a9f106c337c987a7151f22c3c6356b71>>
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
    readonly addressFull: string;
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
    "cacheID": "ee52262532b7fbd0543e91de6fa3df74",
    "id": null,
    "metadata": {},
    "name": "CompaniesHouseSearchQuery",
    "operationKind": "query",
    "text": "query CompaniesHouseSearchQuery(\n  $searchQuery: String!\n) {\n  companies(query: $searchQuery) {\n    registrationNumber\n    title\n    addressFull\n  }\n}\n"
  }
};
})();

(node as any).hash = "c67076fd031cf74cda2e2b73b42f38ae";

export default node;
