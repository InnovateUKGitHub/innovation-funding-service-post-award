/**
 * @generated SignedSource<<9dd9c8dff87229bb4f40ae42e253028a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PcrReasoningWorkflowQuery$variables = {
  pcrId?: string | null | undefined;
  projectId?: string | null | undefined;
};
export type PcrReasoningWorkflowQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectChangeRequest__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Project__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Reasoning__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_RequestHeader__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_RequestNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Name: {
                  readonly label: string | null | undefined;
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly PcrHeader: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly ContentDocumentLinks: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly ContentDocument: {
                      readonly ContentSize: {
                        readonly value: number | null | undefined;
                      } | null | undefined;
                      readonly CreatedBy: {
                        readonly Id: string;
                        readonly Name: {
                          readonly value: string | null | undefined;
                        } | null | undefined;
                      } | null | undefined;
                      readonly CreatedDate: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Description: {
                        readonly value: any | null | undefined;
                      } | null | undefined;
                      readonly FileExtension: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Id: string;
                      readonly LastModifiedBy: {
                        readonly ContactId: {
                          readonly value: string | null | undefined;
                        } | null | undefined;
                      } | null | undefined;
                      readonly LatestPublishedVersionId: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Title: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly LinkedEntityId: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly isFeedAttachment: boolean;
                    readonly isOwner: boolean;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type PcrReasoningWorkflowQuery = {
  response: PcrReasoningWorkflowQuery$data;
  variables: PcrReasoningWorkflowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v3 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrId"
  }
],
v4 = [
  {
    "fields": (v3/*: any*/),
    "kind": "ObjectValue",
    "name": "Id"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v8 = [
  (v7/*: any*/)
],
v9 = [
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
                "alias": "PcrHeader",
                "args": [
                  (v2/*: any*/),
                  {
                    "fields": (v4/*: any*/),
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_ProjectChangeRequest__cConnection",
                "kind": "LinkedField",
                "name": "Acc_ProjectChangeRequest__c",
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
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": [
                              (v6/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "orderBy",
                                "value": {
                                  "ContentDocument": {
                                    "CreatedDate": {
                                      "order": "DESC"
                                    }
                                  }
                                }
                              }
                            ],
                            "concreteType": "ContentDocumentLinkConnection",
                            "kind": "LinkedField",
                            "name": "ContentDocumentLinks",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ContentDocumentLinkEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ContentDocumentLink",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "LinkedEntityId",
                                        "plural": false,
                                        "selections": (v8/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "isFeedAttachment",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "isOwner",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "ContentDocument",
                                        "kind": "LinkedField",
                                        "name": "ContentDocument",
                                        "plural": false,
                                        "selections": [
                                          (v5/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "User",
                                            "kind": "LinkedField",
                                            "name": "LastModifiedBy",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "IDValue",
                                                "kind": "LinkedField",
                                                "name": "ContactId",
                                                "plural": false,
                                                "selections": (v8/*: any*/),
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "LongTextAreaValue",
                                            "kind": "LinkedField",
                                            "name": "Description",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "DateTimeValue",
                                            "kind": "LinkedField",
                                            "name": "CreatedDate",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IDValue",
                                            "kind": "LinkedField",
                                            "name": "LatestPublishedVersionId",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "FileExtension",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Title",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IntValue",
                                            "kind": "LinkedField",
                                            "name": "ContentSize",
                                            "plural": false,
                                            "selections": (v8/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "User",
                                            "kind": "LinkedField",
                                            "name": "CreatedBy",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "StringValue",
                                                "kind": "LinkedField",
                                                "name": "Name",
                                                "plural": false,
                                                "selections": (v8/*: any*/),
                                                "storageKey": null
                                              },
                                              (v5/*: any*/)
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
                            "storageKey": "ContentDocumentLinks(first:2000,orderBy:{\"ContentDocument\":{\"CreatedDate\":{\"order\":\"DESC\"}}})"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v6/*: any*/),
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": (v4/*: any*/),
                            "kind": "ObjectValue",
                            "name": "or.0"
                          },
                          {
                            "fields": [
                              {
                                "fields": (v3/*: any*/),
                                "kind": "ObjectValue",
                                "name": "Acc_RequestHeader__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "or.1"
                          }
                        ],
                        "kind": "ListValue",
                        "name": "or"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_ProjectChangeRequest__cConnection",
                "kind": "LinkedField",
                "name": "Acc_ProjectChangeRequest__c",
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
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Status__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_RequestHeader__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_RequestNumber__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_Reasoning__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_Project__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
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
                                  (v7/*: any*/),
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
                                "selections": (v8/*: any*/),
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
              },
              {
                "alias": null,
                "args": [
                  (v2/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
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
    "name": "PcrReasoningWorkflowQuery",
    "selections": (v9/*: any*/),
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
    "name": "PcrReasoningWorkflowQuery",
    "selections": (v9/*: any*/)
  },
  "params": {
    "cacheID": "b8cad51fb29db945309cfb0ed3d66124",
    "id": null,
    "metadata": {},
    "name": "PcrReasoningWorkflowQuery",
    "operationKind": "query",
    "text": "query PcrReasoningWorkflowQuery(\n  $projectId: ID\n  $pcrId: ID\n) {\n  salesforce {\n    uiapi {\n      query {\n        PcrHeader: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrId}}, first: 1) {\n          edges {\n            node {\n              Id\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    isOwner\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_ProjectChangeRequest__c(where: {or: [{Id: {eq: $pcrId}}, {Acc_RequestHeader__c: {eq: $pcrId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_Status__c {\n                value\n              }\n              Acc_RequestHeader__c {\n                value\n              }\n              Acc_RequestNumber__c {\n                value\n              }\n              Acc_Reasoning__c {\n                value\n              }\n              Acc_Project__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                  label\n                }\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(first: 1, where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "31eee998c8a7ea49f7d2a9589501d067";

export default node;
