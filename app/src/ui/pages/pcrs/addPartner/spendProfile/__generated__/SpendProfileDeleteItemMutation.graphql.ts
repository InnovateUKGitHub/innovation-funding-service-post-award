/**
 * @generated SignedSource<<b88660f9cf60a0dcd54bf72d783e1dba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SpendProfileDeleteItemMutation$variables = {
  id: any;
  projectId: string;
};
export type SpendProfileDeleteItemMutation$data = {
  readonly uiapi: {
    readonly Acc_IFSSpendProfile__cDelete: {
      readonly Id: string | null | undefined;
    } | null | undefined;
  };
};
export type SpendProfileDeleteItemMutation = {
  response: SpendProfileDeleteItemMutation$data;
  variables: SpendProfileDeleteItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "input"
          }
        ],
        "concreteType": "RecordDeletePayload",
        "kind": "LinkedField",
        "name": "Acc_IFSSpendProfile__cDelete",
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
    "name": "SpendProfileDeleteItemMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SpendProfileDeleteItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4f6f195a990653b882cd4abd49526c48",
    "id": null,
    "metadata": {},
    "name": "SpendProfileDeleteItemMutation",
    "operationKind": "mutation",
    "text": "mutation SpendProfileDeleteItemMutation(\n  $id: IdOrRef!\n  $projectId: String!\n) {\n  uiapi(projectId: $projectId) {\n    Acc_IFSSpendProfile__cDelete(input: {Id: $id}) {\n      Id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1ffd95ab009639e2420e6234c414fd3e";

export default node;
