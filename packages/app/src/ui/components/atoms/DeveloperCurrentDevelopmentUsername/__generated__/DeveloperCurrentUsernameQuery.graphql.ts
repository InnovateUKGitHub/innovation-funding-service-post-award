/**
 * @generated SignedSource<<36b68f1bc1519698bdbfc2a1b8538c88>>
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
  readonly developer: {
    readonly email: string | null | undefined;
  };
};
export type DeveloperCurrentUsernameQuery = {
  response: DeveloperCurrentUsernameQuery$data;
  variables: DeveloperCurrentUsernameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "CurrentUserObject",
    "kind": "LinkedField",
    "name": "currentUser",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isSystemUser",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "CurrentUserObject",
    "kind": "LinkedField",
    "name": "developer",
    "plural": false,
    "selections": [
      (v0/*: any*/)
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
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeveloperCurrentUsernameQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e4db747fdf0b4ec2989d12da43832af5",
    "id": null,
    "metadata": {},
    "name": "DeveloperCurrentUsernameQuery",
    "operationKind": "query",
    "text": "query DeveloperCurrentUsernameQuery {\n  currentUser {\n    email\n    isSystemUser\n  }\n  developer {\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "f1d508be724fa81cf3b4784d9e86ecc5";

export default node;
