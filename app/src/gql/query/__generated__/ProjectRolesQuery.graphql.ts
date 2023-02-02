/**
 * @generated SignedSource<<c1cbb097df86d27bd6ce0fc00832357d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProjectRolesQuery$variables = {};
export type ProjectRolesQuery$data = {
  readonly accProjectCustom: ReadonlyArray<{
    readonly accProjectParticipantsProjectReference: ReadonlyArray<{
      readonly accAccountIdCustom: {
        readonly id: string;
      };
      readonly accProjectRoleCustom: string | null;
    } | null> | null;
    readonly id: string;
    readonly projectContactLinksReference: ReadonlyArray<{
      readonly accAccountIdCustom: {
        readonly id: string;
      } | null;
      readonly accContactIdCustom: {
        readonly email: string | null;
      } | null;
      readonly accRoleCustom: string | null;
    } | null> | null;
  }>;
  readonly currentUser: {
    readonly email: string | null;
    readonly isSystemUser: boolean;
  };
};
export type ProjectRolesQuery = {
  response: ProjectRolesQuery$data;
  variables: ProjectRolesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accProjectRoleCustom",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "account",
  "kind": "LinkedField",
  "name": "accAccountIdCustom",
  "plural": false,
  "selections": [
    (v0/*: any*/)
  ],
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accRoleCustom",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrentUserObject",
  "kind": "LinkedField",
  "name": "currentUser",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSystemUser",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectRolesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "accProjectCustom",
        "kind": "LinkedField",
        "name": "accProjectCustom",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectParticipantCustom",
            "kind": "LinkedField",
            "name": "accProjectParticipantsProjectReference",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectContactLinkCustom",
            "kind": "LinkedField",
            "name": "projectContactLinksReference",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "contact",
                "kind": "LinkedField",
                "name": "accContactIdCustom",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v5/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ProjectRolesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "accProjectCustom",
        "kind": "LinkedField",
        "name": "accProjectCustom",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectParticipantCustom",
            "kind": "LinkedField",
            "name": "accProjectParticipantsProjectReference",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectContactLinkCustom",
            "kind": "LinkedField",
            "name": "projectContactLinksReference",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "contact",
                "kind": "LinkedField",
                "name": "accContactIdCustom",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v5/*: any*/)
    ]
  },
  "params": {
    "cacheID": "72d2e7ee16dc197777432a79f964342d",
    "id": null,
    "metadata": {},
    "name": "ProjectRolesQuery",
    "operationKind": "query",
    "text": "query ProjectRolesQuery {\n  accProjectCustom {\n    id\n    accProjectParticipantsProjectReference {\n      accProjectRoleCustom\n      accAccountIdCustom {\n        id\n      }\n      id\n    }\n    projectContactLinksReference {\n      accRoleCustom\n      accContactIdCustom {\n        email\n        id\n      }\n      accAccountIdCustom {\n        id\n      }\n      id\n    }\n  }\n  currentUser {\n    email\n    isSystemUser\n  }\n}\n"
  }
};
})();

(node as any).hash = "c6d953f62d7c4c5513aa3a0aa3c71971";

export default node;
