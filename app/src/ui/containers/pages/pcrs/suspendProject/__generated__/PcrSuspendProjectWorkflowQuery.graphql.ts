/**
 * @generated SignedSource<<c1a20e7a7f9b983208fb629ecfd1359e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PcrSuspendProjectWorkflowQuery$variables = {
  pcrItemId: string;
  projectId: string;
};
export type PcrSuspendProjectWorkflowQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Id: string;
              readonly Project_Change_Requests__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_MarkedasComplete__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_Project__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_RequestHeader__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_RequestNumber__c: {
                      readonly value: number | null;
                    } | null;
                    readonly Acc_Status__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_SuspensionEnds__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_SuspensionStarts__c: {
                      readonly value: string | null;
                    } | null;
                    readonly CreatedDate: {
                      readonly value: string | null;
                    } | null;
                    readonly Id: string;
                    readonly LastModifiedDate: {
                      readonly value: string | null;
                    } | null;
                    readonly RecordType: {
                      readonly DeveloperName: {
                        readonly value: string | null;
                      } | null;
                      readonly Name: {
                        readonly label: string | null;
                        readonly value: string | null;
                      } | null;
                    } | null;
                  } | null;
                } | null> | null;
              } | null;
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
              };
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type PcrSuspendProjectWorkflowQuery = {
  response: PcrSuspendProjectWorkflowQuery$data;
  variables: PcrSuspendProjectWorkflowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrItemId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v4 = [
  (v3/*: any*/)
],
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "SalesforceQuery",
    "kind": "LinkedField",
    "name": "salesforce",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UIAPI",
        "kind": "LinkedField",
        "name": "uiapi",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "RecordQuery",
            "kind": "LinkedField",
            "name": "query",
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
                            "name": "eq",
                            "variableName": "projectId"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "Id"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_Project__cConnection",
                "kind": "LinkedField",
                "name": "Acc_Project__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_Project__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Project__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Ext_Project_Roles",
                            "kind": "LinkedField",
                            "name": "roles",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isPm",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isFc",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isMo",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 2000
                              },
                              {
                                "fields": [
                                  {
                                    "fields": [
                                      {
                                        "kind": "Variable",
                                        "name": "eq",
                                        "variableName": "pcrItemId"
                                      }
                                    ],
                                    "kind": "ObjectValue",
                                    "name": "Id"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "where"
                              }
                            ],
                            "concreteType": "Acc_ProjectChangeRequest__cConnection",
                            "kind": "LinkedField",
                            "name": "Project_Change_Requests__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_ProjectChangeRequest__cEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Acc_ProjectChangeRequest__c",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v2/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Project__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_MarkedasComplete__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_RequestHeader__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DoubleValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_RequestNumber__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Status__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "CreatedDate",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "LastModifiedDate",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_SuspensionStarts__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_SuspensionEnds__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "RecordType",
                                        "kind": "LinkedField",
                                        "name": "RecordType",
                                        "plural": false,
                                        "selections": [
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Name",
                                            "plural": false,
                                            "selections": [
                                              (v3/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "label",
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "DeveloperName",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PcrSuspendProjectWorkflowQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PcrSuspendProjectWorkflowQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "af89b73b9d9b2bdc78bddb40dc1f37d1",
    "id": null,
    "metadata": {},
    "name": "PcrSuspendProjectWorkflowQuery",
    "operationKind": "query",
    "text": "query PcrSuspendProjectWorkflowQuery(\n  $projectId: ID!\n  $pcrItemId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isPm\n                isFc\n                isMo\n              }\n              Project_Change_Requests__r(first: 2000, where: {Id: {eq: $pcrItemId}}) {\n                edges {\n                  node {\n                    Id\n                    Acc_Project__c {\n                      value\n                    }\n                    Acc_MarkedasComplete__c {\n                      value\n                    }\n                    Acc_RequestHeader__c {\n                      value\n                    }\n                    Acc_RequestNumber__c {\n                      value\n                    }\n                    Acc_Status__c {\n                      value\n                    }\n                    CreatedDate {\n                      value\n                    }\n                    LastModifiedDate {\n                      value\n                    }\n                    Acc_SuspensionStarts__c {\n                      value\n                    }\n                    Acc_SuspensionEnds__c {\n                      value\n                    }\n                    RecordType {\n                      Name {\n                        value\n                        label\n                      }\n                      DeveloperName {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1a99fe8f76fc2bc7d89415503e6eb0c4";

export default node;
