/**
 * @generated SignedSource<<956953e777193c9f3c3da0e81c46206d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PcrDeleteMutation$variables = {
  pcrId: any;
  projectId: string;
};
export type PcrDeleteMutation$data = {
  readonly uiapi: {
    readonly Acc_ProjectChangeRequest__cDelete: {
      readonly Id: string | null | undefined;
    } | null | undefined;
  };
};
export type PcrDeleteMutation = {
  response: PcrDeleteMutation$data;
  variables: PcrDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pcrId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectId"
      }
    ],
    "concreteType": "UIAPIMutations",
    "kind": "LinkedField",
    "name": "uiapi",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "Id",
                "variableName": "pcrId"
              }
            ],
            "kind": "ObjectValue",
            "name": "input"
          }
        ],
        "concreteType": "RecordDeletePayload",
        "kind": "LinkedField",
        "name": "Acc_ProjectChangeRequest__cDelete",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "Id",
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
    "name": "PcrDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PcrDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0b7ed5b3a62d9a44bbfb8ed4d3f1e326",
    "id": null,
    "metadata": {},
    "name": "PcrDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PcrDeleteMutation(\n  $pcrId: IdOrRef!\n  $projectId: String!\n) {\n  uiapi(projectId: $projectId) {\n    Acc_ProjectChangeRequest__cDelete(input: {Id: $pcrId}) {\n      Id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3444d7e255103ed25b857721613bc72c";

export default node;
