/**
 * @generated SignedSource<<60c6f50ecd4419f00c2a3af085f63798>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PcrModifyOptionsCreateHeaderMutation$variables = {
  projectId: any;
  projectIdStr: string;
};
export type PcrModifyOptionsCreateHeaderMutation$data = {
  readonly uiapi: {
    readonly Acc_ProjectChangeRequest__cCreate: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
  };
};
export type PcrModifyOptionsCreateHeaderMutation = {
  response: PcrModifyOptionsCreateHeaderMutation$data;
  variables: PcrModifyOptionsCreateHeaderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectIdStr"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectIdStr"
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
                    "kind": "Literal",
                    "name": "Acc_MarkedasComplete__c",
                    "value": "To Do"
                  },
                  {
                    "kind": "Variable",
                    "name": "Acc_Project__c",
                    "variableName": "projectId"
                  },
                  {
                    "kind": "Literal",
                    "name": "Acc_Status__c",
                    "value": "Draft"
                  },
                  {
                    "kind": "Literal",
                    "name": "RecordTypeId",
                    "value": "0124I000000FZHaQAO"
                  }
                ],
                "kind": "ObjectValue",
                "name": "Acc_ProjectChangeRequest__c"
              }
            ],
            "kind": "ObjectValue",
            "name": "input"
          }
        ],
        "concreteType": "Acc_ProjectChangeRequest__cCreatePayload",
        "kind": "LinkedField",
        "name": "Acc_ProjectChangeRequest__cCreate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Acc_ProjectChangeRequest__c",
            "kind": "LinkedField",
            "name": "Record",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "Id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StringValue",
                "kind": "LinkedField",
                "name": "Name",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
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
    "name": "PcrModifyOptionsCreateHeaderMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PcrModifyOptionsCreateHeaderMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "64d0ce2431dddfe85a7cdbf6c289cd55",
    "id": null,
    "metadata": {},
    "name": "PcrModifyOptionsCreateHeaderMutation",
    "operationKind": "mutation",
    "text": "mutation PcrModifyOptionsCreateHeaderMutation(\n  $projectId: IdOrRef!\n  $projectIdStr: String!\n) {\n  uiapi(projectId: $projectIdStr) {\n    Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {RecordTypeId: \"0124I000000FZHaQAO\", Acc_MarkedasComplete__c: \"To Do\", Acc_Status__c: \"Draft\", Acc_Project__c: $projectId}}) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1aa06e424bb73d35cefb3e34cd951b6a";

export default node;
