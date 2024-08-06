/**
 * @generated SignedSource<<8258aa6a766c5805c9ead0461fe06c4c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PcrModifyOptionsCreateMultipleMutation$variables = {
  hasPcr2: boolean;
  hasPcr3: boolean;
  hasPcr4: boolean;
  hasPcr5: boolean;
  headerId: any;
  projectId: any;
  projectIdStr: string;
  recordType1: any;
  recordType2?: any | null | undefined;
  recordType3?: any | null | undefined;
  recordType4?: any | null | undefined;
  recordType5?: any | null | undefined;
};
export type PcrModifyOptionsCreateMultipleMutation$data = {
  readonly uiapi: {
    readonly fifthPcr?: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly firstPcr: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly fourthPcr?: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly secondPcr?: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly thirdPcr?: {
      readonly Record: {
        readonly Id: string;
        readonly Name: {
          readonly value: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined;
  };
};
export type PcrModifyOptionsCreateMultipleMutation = {
  response: PcrModifyOptionsCreateMultipleMutation$data;
  variables: PcrModifyOptionsCreateMultipleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "hasPcr2"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "hasPcr3"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "hasPcr4"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "hasPcr5"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "headerId"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectIdStr"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recordType1"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recordType2"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recordType3"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recordType4"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recordType5"
},
v12 = {
  "kind": "Literal",
  "name": "Acc_MarkedasComplete__c",
  "value": "To Do"
},
v13 = {
  "kind": "Variable",
  "name": "Acc_Project__c",
  "variableName": "projectId"
},
v14 = {
  "kind": "Variable",
  "name": "Acc_RequestHeader__c",
  "variableName": "headerId"
},
v15 = [
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
v16 = [
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
        "alias": "firstPcr",
        "args": [
          {
            "fields": [
              {
                "fields": [
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  {
                    "kind": "Variable",
                    "name": "RecordTypeId",
                    "variableName": "recordType1"
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
        "selections": (v15/*: any*/),
        "storageKey": null
      },
      {
        "condition": "hasPcr2",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "secondPcr",
            "args": [
              {
                "fields": [
                  {
                    "fields": [
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      {
                        "kind": "Variable",
                        "name": "RecordTypeId",
                        "variableName": "recordType2"
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
            "selections": (v15/*: any*/),
            "storageKey": null
          }
        ]
      },
      {
        "condition": "hasPcr3",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "thirdPcr",
            "args": [
              {
                "fields": [
                  {
                    "fields": [
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      {
                        "kind": "Variable",
                        "name": "RecordTypeId",
                        "variableName": "recordType3"
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
            "selections": (v15/*: any*/),
            "storageKey": null
          }
        ]
      },
      {
        "condition": "hasPcr4",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "fourthPcr",
            "args": [
              {
                "fields": [
                  {
                    "fields": [
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      {
                        "kind": "Variable",
                        "name": "RecordTypeId",
                        "variableName": "recordType4"
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
            "selections": (v15/*: any*/),
            "storageKey": null
          }
        ]
      },
      {
        "condition": "hasPcr5",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "fifthPcr",
            "args": [
              {
                "fields": [
                  {
                    "fields": [
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      {
                        "kind": "Variable",
                        "name": "RecordTypeId",
                        "variableName": "recordType5"
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
            "selections": (v15/*: any*/),
            "storageKey": null
          }
        ]
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
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PcrModifyOptionsCreateMultipleMutation",
    "selections": (v16/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v5/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "PcrModifyOptionsCreateMultipleMutation",
    "selections": (v16/*: any*/)
  },
  "params": {
    "cacheID": "a34962606123835e42a73b07d51d511f",
    "id": null,
    "metadata": {},
    "name": "PcrModifyOptionsCreateMultipleMutation",
    "operationKind": "mutation",
    "text": "mutation PcrModifyOptionsCreateMultipleMutation(\n  $headerId: IdOrRef!\n  $projectId: IdOrRef!\n  $hasPcr2: Boolean!\n  $hasPcr3: Boolean!\n  $hasPcr4: Boolean!\n  $hasPcr5: Boolean!\n  $recordType1: IdOrRef!\n  $recordType2: IdOrRef\n  $recordType3: IdOrRef\n  $recordType4: IdOrRef\n  $recordType5: IdOrRef\n  $projectIdStr: String!\n) {\n  uiapi(projectId: $projectIdStr) {\n    firstPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: \"To Do\", RecordTypeId: $recordType1}}) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n    secondPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: \"To Do\", RecordTypeId: $recordType2}}) @include(if: $hasPcr2) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n    thirdPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: \"To Do\", RecordTypeId: $recordType3}}) @include(if: $hasPcr3) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n    fourthPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: \"To Do\", RecordTypeId: $recordType4}}) @include(if: $hasPcr4) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n    fifthPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: \"To Do\", RecordTypeId: $recordType5}}) @include(if: $hasPcr5) {\n      Record {\n        Id\n        Name {\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cb14b74eda513bed3f5efa0e31ce5e5e";

export default node;
