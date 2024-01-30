/**
 * @generated SignedSource<<aff541097af6a93519c6981029df80d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UpliftSummaryQuery$variables = {
  pcrId: string;
  pcrItemId: string;
};
export type UpliftSummaryQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Child: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Reasoning__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Documents: {
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
              readonly isFeedAttachment: boolean;
              readonly isOwner: boolean;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Header: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_RequestNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type UpliftSummaryQuery = {
  response: UpliftSummaryQuery$data;
  variables: UpliftSummaryQuery$variables;
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
    "name": "pcrItemId"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v4 = [
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
                "alias": "Header",
                "args": [
                  (v1/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "eq",
                            "variableName": "pcrId"
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_RequestNumber__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
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
                "alias": "Child",
                "args": [
                  (v1/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_Reasoning__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
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
                "alias": "Documents",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 2000
                  },
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
                  },
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "items": [
                              {
                                "kind": "Variable",
                                "name": "in.0",
                                "variableName": "pcrId"
                              },
                              {
                                "kind": "Variable",
                                "name": "in.1",
                                "variableName": "pcrItemId"
                              }
                            ],
                            "kind": "ListValue",
                            "name": "in"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "LinkedEntityId"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "ContentDocumentLinkConnection",
                "kind": "LinkedField",
                "name": "ContentDocumentLink",
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
                              (v3/*: any*/),
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
                                    "selections": (v2/*: any*/),
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
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateTimeValue",
                                "kind": "LinkedField",
                                "name": "CreatedDate",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "IDValue",
                                "kind": "LinkedField",
                                "name": "LatestPublishedVersionId",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "FileExtension",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Title",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "IntValue",
                                "kind": "LinkedField",
                                "name": "ContentSize",
                                "plural": false,
                                "selections": (v2/*: any*/),
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
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  (v3/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpliftSummaryQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpliftSummaryQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "abd73885d427c3329647027a6880a837",
    "id": null,
    "metadata": {},
    "name": "UpliftSummaryQuery",
    "operationKind": "query",
    "text": "query UpliftSummaryQuery(\n  $pcrId: ID!\n  $pcrItemId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Header: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrId}}, first: 1) {\n          edges {\n            node {\n              Acc_RequestNumber__c {\n                value\n              }\n            }\n          }\n        }\n        Child: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrItemId}}, first: 1) {\n          edges {\n            node {\n              Acc_Reasoning__c {\n                value\n              }\n            }\n          }\n        }\n        Documents: ContentDocumentLink(where: {LinkedEntityId: {in: [$pcrId, $pcrItemId]}}, first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n          edges {\n            node {\n              isFeedAttachment\n              isOwner\n              ContentDocument {\n                Id\n                LastModifiedBy {\n                  ContactId {\n                    value\n                  }\n                }\n                Description {\n                  value\n                }\n                CreatedDate {\n                  value\n                }\n                LatestPublishedVersionId {\n                  value\n                }\n                FileExtension {\n                  value\n                }\n                Title {\n                  value\n                }\n                ContentSize {\n                  value\n                }\n                CreatedBy {\n                  Name {\n                    value\n                  }\n                  Id\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b8e0badbaf5ac5a82500cd31d32006dc";

export default node;
