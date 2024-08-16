/**
 * @generated SignedSource<<28ef62e7ef974233388863ad20526b88>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DeveloperCurrentDevelopmentUsernameQuery$variables = Record<PropertyKey, never>;
export type DeveloperCurrentDevelopmentUsernameQuery$data = {
  readonly developer: {
    readonly email: string | null | undefined;
  };
};
export type DeveloperCurrentDevelopmentUsernameQuery = {
  response: DeveloperCurrentDevelopmentUsernameQuery$data;
  variables: DeveloperCurrentDevelopmentUsernameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "CurrentUserObject",
    "kind": "LinkedField",
    "name": "developer",
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeveloperCurrentDevelopmentUsernameQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeveloperCurrentDevelopmentUsernameQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "0556a8b9e30621635643a1189dc5d83c",
    "id": null,
    "metadata": {},
    "name": "DeveloperCurrentDevelopmentUsernameQuery",
    "operationKind": "query",
    "text": "query DeveloperCurrentDevelopmentUsernameQuery {\n  developer {\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "f096e06805fbf95e14b5efed3d4509dd";

export default node;
