/**
 * @generated SignedSource<<5b3287b0547b18f589e48ba69391b9ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DeveloperCurrentUsernameQuery$variables = Record<PropertyKey, never>;
export type DeveloperCurrentUsernameQuery$data = {
  readonly currentUser: {
    readonly email: string | null | undefined;
    readonly isSystemUser: boolean;
  };
};
export type DeveloperCurrentUsernameQuery = {
  response: DeveloperCurrentUsernameQuery$data;
  variables: DeveloperCurrentUsernameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isSystemUser",
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
    "name": "DeveloperCurrentUsernameQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeveloperCurrentUsernameQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "8058205e7a1f4fe93989f115e69a1726",
    "id": null,
    "metadata": {},
    "name": "DeveloperCurrentUsernameQuery",
    "operationKind": "query",
    "text": "query DeveloperCurrentUsernameQuery {\n  currentUser {\n    email\n    isSystemUser\n  }\n}\n"
  }
};
})();

(node as any).hash = "b9a6d816aa4a13c79da0992f76f7b574";

export default node;
