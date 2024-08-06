/**
 * @generated SignedSource<<93cce48fb8fe5cba8c0ffc04af6dfc94>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PartnerDetailsEditMutation$variables = {
  partnerId: any;
  partnerIdStr: string;
  postcode: string;
  projectId: string;
};
export type PartnerDetailsEditMutation$data = {
  readonly uiapi: {
    readonly Acc_ProjectParticipant__cUpdate: {
      readonly success: boolean | null | undefined;
    } | null | undefined;
  };
};
export type PartnerDetailsEditMutation = {
  response: PartnerDetailsEditMutation$data;
  variables: PartnerDetailsEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerIdStr"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "postcode"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "partnerId",
        "variableName": "partnerIdStr"
      },
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
                "fields": [
                  {
                    "kind": "Variable",
                    "name": "Acc_Postcode__c",
                    "variableName": "postcode"
                  }
                ],
                "kind": "ObjectValue",
                "name": "Acc_ProjectParticipant__c"
              },
              {
                "kind": "Variable",
                "name": "Id",
                "variableName": "partnerId"
              }
            ],
            "kind": "ObjectValue",
            "name": "input"
          }
        ],
        "concreteType": "Acc_ProjectParticipant__cUpdatePayload",
        "kind": "LinkedField",
        "name": "Acc_ProjectParticipant__cUpdate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "success",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PartnerDetailsEditMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "PartnerDetailsEditMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "111a07d83b9bcf5afbb00e69ab87293e",
    "id": null,
    "metadata": {},
    "name": "PartnerDetailsEditMutation",
    "operationKind": "mutation",
    "text": "mutation PartnerDetailsEditMutation(\n  $partnerId: IdOrRef!\n  $postcode: String!\n  $projectId: String!\n  $partnerIdStr: String!\n) {\n  uiapi(projectId: $projectId, partnerId: $partnerIdStr) {\n    Acc_ProjectParticipant__cUpdate(input: {Id: $partnerId, Acc_ProjectParticipant__c: {Acc_Postcode__c: $postcode}}) {\n      success\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b414addc9ea47c0cc4cb4559bda47197";

export default node;
