/**
 * @generated SignedSource<<4447314c34e600d6d51c1cc25d8cd999>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ClaimDetailDocumentsQuery$variables = {
  costCategoryId: string;
  partnerId: string;
  periodId?: number | null | undefined;
  projectId: string;
  projectIdStr: string;
};
export type ClaimDetailDocumentsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_CostCategory__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategoryName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_DisplayOrder__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Impact_Management_Participation__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly partnerRoles: ReadonlyArray<{
                  readonly isAssociate: boolean;
                  readonly isFc: boolean;
                  readonly isMo: boolean;
                  readonly isPm: boolean;
                  readonly partnerId: string;
                }>;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly ClaimsDocuments: {
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
                      readonly FileType: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Id: string;
                      readonly LastModifiedBy: {
                        readonly ContactId: {
                          readonly value: string | null | undefined;
                        } | null | undefined;
                      } | null | undefined;
                      readonly LastModifiedDate: {
                        readonly value: string | null | undefined;
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
export type ClaimDetailDocumentsQuery = {
  response: ClaimDetailDocumentsQuery$data;
  variables: ClaimDetailDocumentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "costCategoryId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "periodId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectIdStr"
},
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v12 = [
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
                  (v5/*: any*/)
                ],
                "concreteType": "Acc_CostCategory__cConnection",
                "kind": "LinkedField",
                "name": "Acc_CostCategory__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_CostCategory__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_CostCategory__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryName__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_DisplayOrder__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_OrganisationType__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "Acc_CostCategory__c(first:2000)"
              },
              {
                "alias": "ClaimsDocuments",
                "args": [
                  (v5/*: any*/),
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": [
                              {
                                "fields": [
                                  {
                                    "kind": "Variable",
                                    "name": "eq",
                                    "variableName": "projectIdStr"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectID__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.0"
                          },
                          {
                            "fields": [
                              {
                                "fields": [
                                  {
                                    "kind": "Variable",
                                    "name": "eq",
                                    "variableName": "partnerId"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectParticipant__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.1"
                          },
                          {
                            "fields": [
                              {
                                "fields": [
                                  {
                                    "kind": "Variable",
                                    "name": "eq",
                                    "variableName": "periodId"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectPeriodNumber__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.2"
                          },
                          {
                            "fields": [
                              {
                                "fields": [
                                  {
                                    "kind": "Variable",
                                    "name": "eq",
                                    "variableName": "costCategoryId"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "Acc_CostCategory__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.3"
                          },
                          {
                            "kind": "Literal",
                            "name": "and.4",
                            "value": {
                              "RecordType": {
                                "DeveloperName": {
                                  "eq": "Claims_Detail"
                                }
                              }
                            }
                          },
                          {
                            "kind": "Literal",
                            "name": "and.5",
                            "value": {
                              "Acc_ClaimStatus__c": {
                                "ne": "New"
                              }
                            }
                          },
                          {
                            "kind": "Literal",
                            "name": "and.6",
                            "value": {
                              "Acc_ClaimStatus__c": {
                                "ne": "Not used"
                              }
                            }
                          }
                        ],
                        "kind": "ListValue",
                        "name": "and"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_Claims__cConnection",
                "kind": "LinkedField",
                "name": "Acc_Claims__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_Claims__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Claims__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": [
                              (v5/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "orderBy",
                                "value": {
                                  "ContentDocument": {
                                    "LastModifiedDate": {
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
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "LinkedEntityId",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
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
                                          (v6/*: any*/),
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
                                                "selections": (v7/*: any*/),
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IDValue",
                                            "kind": "LinkedField",
                                            "name": "LatestPublishedVersionId",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "LongTextAreaValue",
                                            "kind": "LinkedField",
                                            "name": "Description",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IntValue",
                                            "kind": "LinkedField",
                                            "name": "ContentSize",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "DateTimeValue",
                                            "kind": "LinkedField",
                                            "name": "CreatedDate",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "FileType",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "FileExtension",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Title",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "DateTimeValue",
                                            "kind": "LinkedField",
                                            "name": "LastModifiedDate",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
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
                                              (v6/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "StringValue",
                                                "kind": "LinkedField",
                                                "name": "Name",
                                                "plural": false,
                                                "selections": (v7/*: any*/),
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
                            "storageKey": "ContentDocumentLinks(first:2000,orderBy:{\"ContentDocument\":{\"LastModifiedDate\":{\"order\":\"DESC\"}}})"
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
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1
                  },
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
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Ext_Project_Roles",
                            "kind": "LinkedField",
                            "name": "roles",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Partner_Roles",
                                "kind": "LinkedField",
                                "name": "partnerRoles",
                                "plural": true,
                                "selections": [
                                  (v9/*: any*/),
                                  (v8/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "partnerId",
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
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Impact_Management_Participation__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimDetailDocumentsQuery",
    "selections": (v12/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClaimDetailDocumentsQuery",
    "selections": (v12/*: any*/)
  },
  "params": {
    "cacheID": "83a721e6644b50a46cb60f46186427a4",
    "id": null,
    "metadata": {},
    "name": "ClaimDetailDocumentsQuery",
    "operationKind": "query",
    "text": "query ClaimDetailDocumentsQuery(\n  $projectId: ID!\n  $partnerId: ID!\n  $periodId: Double\n  $costCategoryId: ID!\n  $projectIdStr: String!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimsDocuments: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {Acc_CostCategory__c: {eq: $costCategoryId}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_ClaimStatus__c: {ne: \"Not used\"}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {LastModifiedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    isFeedAttachment\n                    isOwner\n                    LinkedEntityId {\n                      value\n                    }\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      Description {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      FileType {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      LastModifiedDate {\n                        value\n                      }\n                      CreatedBy {\n                        Id\n                        Name {\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(first: 1, where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  isAssociate\n                  partnerId\n                }\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Impact_Management_Participation__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ca06dd4939a1537e3202063ed9abc2dc";

export default node;
