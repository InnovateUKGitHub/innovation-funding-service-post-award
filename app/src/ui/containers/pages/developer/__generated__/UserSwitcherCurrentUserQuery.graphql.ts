/**
 * @generated SignedSource<<96d719b8e36514ba0e787d4ff08de377>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserSwitcherCurrentUserQuery$variables = Record<PropertyKey, never>;
export type UserSwitcherCurrentUserQuery$data = {
  readonly currentUser: {
    readonly email: string | null | undefined;
    readonly isSystemUser: boolean;
  };
};
export type UserSwitcherCurrentUserQuery = {
  response: UserSwitcherCurrentUserQuery$data;
  variables: UserSwitcherCurrentUserQuery$variables;
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
    "name": "UserSwitcherCurrentUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserSwitcherCurrentUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "0985926b566e62916d3e212bab9ff6b0",
    "id": null,
    "metadata": {},
    "name": "UserSwitcherCurrentUserQuery",
    "operationKind": "query",
    "text": "query UserSwitcherCurrentUserQuery {\n  currentUser {\n    email\n    isSystemUser\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d054353f751c44c7c234f36f9ccf2e0";

export default node;
