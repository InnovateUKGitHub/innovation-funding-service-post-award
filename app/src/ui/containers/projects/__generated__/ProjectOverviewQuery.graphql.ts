/**
 * @generated SignedSource<<17acaedfeed9411849c2d0dd971b578b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProjectOverviewQuery$variables = {
  projectId?: string | null;
};
export type ProjectOverviewQuery$data = {
  readonly accProjectCustomById: {
    readonly accGolTotalCostAwardedCustom: number | null;
    readonly accLeadParticipantIdCustom: string | null;
    readonly accProjectNumberCustom: string | null;
    readonly accProjectParticipantsProjectReference: ReadonlyArray<{
      readonly accAccountIdCustom: {
        readonly id: string;
        readonly name: string | null;
      };
      readonly accTotalApprovedCostsCustom: number | null;
      readonly accTotalParticipantGrantCustom: number | null;
    } | null> | null;
    readonly accProjectTitleCustom: string | null;
    readonly accTotalProjectCostsCustom: number | null;
  } | null;
  readonly currentUser: {
    readonly email: string | null;
  };
};
export type ProjectOverviewQuery = {
  response: ProjectOverviewQuery$data;
  variables: ProjectOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "projectId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accTotalProjectCostsCustom",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accGolTotalCostAwardedCustom",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accLeadParticipantIdCustom",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accProjectNumberCustom",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accProjectTitleCustom",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accTotalParticipantGrantCustom",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accTotalApprovedCostsCustom",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "account",
  "kind": "LinkedField",
  "name": "accAccountIdCustom",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    (v9/*: any*/)
  ],
  "storageKey": null
},
v11 = {
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
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectOverviewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "accProjectCustom",
        "kind": "LinkedField",
        "name": "accProjectCustomById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectParticipantCustom",
            "kind": "LinkedField",
            "name": "accProjectParticipantsProjectReference",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/),
              (v10/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v11/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProjectOverviewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "accProjectCustom",
        "kind": "LinkedField",
        "name": "accProjectCustomById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "accProjectParticipantCustom",
            "kind": "LinkedField",
            "name": "accProjectParticipantsProjectReference",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/),
              (v10/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      },
      (v11/*: any*/)
    ]
  },
  "params": {
    "cacheID": "966e245f975e1f597bb588e1f314fa1d",
    "id": null,
    "metadata": {},
    "name": "ProjectOverviewQuery",
    "operationKind": "query",
    "text": "query ProjectOverviewQuery(\n  $projectId: ID\n) {\n  accProjectCustomById(id: $projectId) {\n    accTotalProjectCostsCustom\n    accGolTotalCostAwardedCustom\n    accLeadParticipantIdCustom\n    accProjectNumberCustom\n    accProjectTitleCustom\n    accProjectParticipantsProjectReference {\n      accTotalParticipantGrantCustom\n      accTotalApprovedCostsCustom\n      accAccountIdCustom {\n        name\n        id\n      }\n      id\n    }\n    id\n  }\n  currentUser {\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "999907af3f08310dad70c029a49f2563";

export default node;
