/**
 * @generated SignedSource<<eac8d5f1905853bf960ce809a071ffd3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
export type ProjectDocumentsQuery$variables = {
  projectId: string;
};
export type ProjectDocumentsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectParticipant__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_AccountId__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_AccountId__r:
                                | {
                                    readonly Name:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectRole__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly ContentDocumentLinks: {
                                readonly edges: ReadonlyArray<{
                                  readonly node: {
                                    readonly ContentDocument:
                                      | {
                                          readonly ContentSize:
                                            | {
                                                readonly value: number | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly CreatedBy:
                                            | {
                                                readonly Id: string;
                                                readonly Name:
                                                  | {
                                                      readonly value: string | null | undefined;
                                                    }
                                                  | null
                                                  | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly CreatedDate:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Description:
                                            | {
                                                readonly value: any | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly FileExtension:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly FileType:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Id: string;
                                          readonly LastModifiedBy:
                                            | {
                                                readonly ContactId:
                                                  | {
                                                      readonly value: string | null | undefined;
                                                    }
                                                  | null
                                                  | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly LastModifiedDate:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly LatestPublishedVersionId:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Title:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                        }
                                      | null
                                      | undefined;
                                    readonly Id: string;
                                    readonly LinkedEntityId:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                    readonly isFeedAttachment: boolean;
                                    readonly isOwner: boolean;
                                  } | null;
                                } | null> | null;
                              } | null;
                              readonly Id: string;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
        readonly Acc_Project__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_ProjectNumber__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectStatus__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectTitle__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly ContentDocumentLinks: {
                                readonly edges: ReadonlyArray<{
                                  readonly node: {
                                    readonly ContentDocument:
                                      | {
                                          readonly ContentSize:
                                            | {
                                                readonly value: number | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly CreatedBy:
                                            | {
                                                readonly Id: string;
                                                readonly Name:
                                                  | {
                                                      readonly value: string | null | undefined;
                                                    }
                                                  | null
                                                  | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly CreatedDate:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Description:
                                            | {
                                                readonly value: any | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly FileExtension:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly FileType:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Id: string;
                                          readonly LastModifiedBy:
                                            | {
                                                readonly ContactId:
                                                  | {
                                                      readonly value: string | null | undefined;
                                                    }
                                                  | null
                                                  | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly LastModifiedDate:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly LatestPublishedVersionId:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                          readonly Title:
                                            | {
                                                readonly value: string | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                        }
                                      | null
                                      | undefined;
                                    readonly Id: string;
                                    readonly isFeedAttachment: boolean;
                                    readonly isOwner: boolean;
                                  } | null;
                                } | null> | null;
                              } | null;
                              readonly Id: string;
                              readonly roles: {
                                readonly isFc: boolean;
                                readonly isMo: boolean;
                                readonly isPm: boolean;
                                readonly partnerRoles: ReadonlyArray<{
                                  readonly isFc: boolean;
                                  readonly isMo: boolean;
                                  readonly isPm: boolean;
                                  readonly partnerId: string;
                                }>;
                              };
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      };
    };
  };
};
export type ProjectDocumentsQuery = {
  response: ProjectDocumentsQuery$data;
  variables: ProjectDocumentsQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "projectId",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v3 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "value",
        storageKey: null,
      },
    ],
    v4 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Name",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    },
    v5 = [
      {
        kind: "Literal",
        name: "first",
        value: 2000,
      },
      {
        kind: "Literal",
        name: "orderBy",
        value: {
          ContentDocument: {
            LastModifiedDate: {
              order: "DESC",
            },
          },
        },
      },
    ],
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFeedAttachment",
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isOwner",
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      concreteType: "ContentDocument",
      kind: "LinkedField",
      name: "ContentDocument",
      plural: false,
      selections: [
        v2 /*: any*/,
        {
          alias: null,
          args: null,
          concreteType: "User",
          kind: "LinkedField",
          name: "LastModifiedBy",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "IDValue",
              kind: "LinkedField",
              name: "ContactId",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "IDValue",
          kind: "LinkedField",
          name: "LatestPublishedVersionId",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "LongTextAreaValue",
          kind: "LinkedField",
          name: "Description",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "IntValue",
          kind: "LinkedField",
          name: "ContentSize",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "DateTimeValue",
          kind: "LinkedField",
          name: "CreatedDate",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "StringValue",
          kind: "LinkedField",
          name: "FileType",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "StringValue",
          kind: "LinkedField",
          name: "FileExtension",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "StringValue",
          kind: "LinkedField",
          name: "Title",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "DateTimeValue",
          kind: "LinkedField",
          name: "LastModifiedDate",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "User",
          kind: "LinkedField",
          name: "CreatedBy",
          plural: false,
          selections: [v2 /*: any*/, v4 /*: any*/],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v12 = [
      {
        alias: null,
        args: null,
        concreteType: "SalesforceQuery",
        kind: "LinkedField",
        name: "salesforce",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "UIAPI",
            kind: "LinkedField",
            name: "uiapi",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "RecordQuery",
                kind: "LinkedField",
                name: "query",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: [
                      {
                        kind: "Literal",
                        name: "first",
                        value: 200,
                      },
                      {
                        kind: "Literal",
                        name: "orderBy",
                        value: {
                          Acc_AccountId__r: {
                            Name: {
                              order: "ASC",
                            },
                          },
                        },
                      },
                      {
                        fields: [
                          {
                            fields: v1 /*: any*/,
                            kind: "ObjectValue",
                            name: "Acc_ProjectId__c",
                          },
                        ],
                        kind: "ObjectValue",
                        name: "where",
                      },
                    ],
                    concreteType: "Acc_ProjectParticipant__cConnection",
                    kind: "LinkedField",
                    name: "Acc_ProjectParticipant__c",
                    plural: false,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        concreteType: "Acc_ProjectParticipant__cEdge",
                        kind: "LinkedField",
                        name: "edges",
                        plural: true,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "Acc_ProjectParticipant__c",
                            kind: "LinkedField",
                            name: "node",
                            plural: false,
                            selections: [
                              v2 /*: any*/,
                              {
                                alias: null,
                                args: null,
                                concreteType: "IDValue",
                                kind: "LinkedField",
                                name: "Acc_AccountId__c",
                                plural: false,
                                selections: v3 /*: any*/,
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "Account",
                                kind: "LinkedField",
                                name: "Acc_AccountId__r",
                                plural: false,
                                selections: [v4 /*: any*/],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "PicklistValue",
                                kind: "LinkedField",
                                name: "Acc_ProjectRole__c",
                                plural: false,
                                selections: v3 /*: any*/,
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: v5 /*: any*/,
                                concreteType: "ContentDocumentLinkConnection",
                                kind: "LinkedField",
                                name: "ContentDocumentLinks",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "ContentDocumentLinkEdge",
                                    kind: "LinkedField",
                                    name: "edges",
                                    plural: true,
                                    selections: [
                                      {
                                        alias: null,
                                        args: null,
                                        concreteType: "ContentDocumentLink",
                                        kind: "LinkedField",
                                        name: "node",
                                        plural: false,
                                        selections: [
                                          v2 /*: any*/,
                                          {
                                            alias: null,
                                            args: null,
                                            concreteType: "IDValue",
                                            kind: "LinkedField",
                                            name: "LinkedEntityId",
                                            plural: false,
                                            selections: v3 /*: any*/,
                                            storageKey: null,
                                          },
                                          v6 /*: any*/,
                                          v7 /*: any*/,
                                          v8 /*: any*/,
                                        ],
                                        storageKey: null,
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                ],
                                storageKey:
                                  'ContentDocumentLinks(first:2000,orderBy:{"ContentDocument":{"LastModifiedDate":{"order":"DESC"}}})',
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: [
                      {
                        kind: "Literal",
                        name: "first",
                        value: 1,
                      },
                      {
                        fields: [
                          {
                            fields: v1 /*: any*/,
                            kind: "ObjectValue",
                            name: "Id",
                          },
                        ],
                        kind: "ObjectValue",
                        name: "where",
                      },
                    ],
                    concreteType: "Acc_Project__cConnection",
                    kind: "LinkedField",
                    name: "Acc_Project__c",
                    plural: false,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        concreteType: "Acc_Project__cEdge",
                        kind: "LinkedField",
                        name: "edges",
                        plural: true,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "Acc_Project__c",
                            kind: "LinkedField",
                            name: "node",
                            plural: false,
                            selections: [
                              v2 /*: any*/,
                              {
                                alias: null,
                                args: null,
                                concreteType: "Ext_Project_Roles",
                                kind: "LinkedField",
                                name: "roles",
                                plural: false,
                                selections: [
                                  v9 /*: any*/,
                                  v10 /*: any*/,
                                  v11 /*: any*/,
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Ext_Partner_Roles",
                                    kind: "LinkedField",
                                    name: "partnerRoles",
                                    plural: true,
                                    selections: [
                                      v10 /*: any*/,
                                      v9 /*: any*/,
                                      v11 /*: any*/,
                                      {
                                        alias: null,
                                        args: null,
                                        kind: "ScalarField",
                                        name: "partnerId",
                                        storageKey: null,
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "StringValue",
                                kind: "LinkedField",
                                name: "Acc_ProjectNumber__c",
                                plural: false,
                                selections: v3 /*: any*/,
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "StringValue",
                                kind: "LinkedField",
                                name: "Acc_ProjectTitle__c",
                                plural: false,
                                selections: v3 /*: any*/,
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "PicklistValue",
                                kind: "LinkedField",
                                name: "Acc_ProjectStatus__c",
                                plural: false,
                                selections: v3 /*: any*/,
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: v5 /*: any*/,
                                concreteType: "ContentDocumentLinkConnection",
                                kind: "LinkedField",
                                name: "ContentDocumentLinks",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "ContentDocumentLinkEdge",
                                    kind: "LinkedField",
                                    name: "edges",
                                    plural: true,
                                    selections: [
                                      {
                                        alias: null,
                                        args: null,
                                        concreteType: "ContentDocumentLink",
                                        kind: "LinkedField",
                                        name: "node",
                                        plural: false,
                                        selections: [v2 /*: any*/, v6 /*: any*/, v7 /*: any*/, v8 /*: any*/],
                                        storageKey: null,
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                ],
                                storageKey:
                                  'ContentDocumentLinks(first:2000,orderBy:{"ContentDocument":{"LastModifiedDate":{"order":"DESC"}}})',
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "ProjectDocumentsQuery",
      selections: v12 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "ProjectDocumentsQuery",
      selections: v12 /*: any*/,
    },
    params: {
      cacheID: "e61c3d81b0ad685db1d891565f73f408",
      id: null,
      metadata: {},
      name: "ProjectDocumentsQuery",
      operationKind: "query",
      text: "query ProjectDocumentsQuery(\n  $projectId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_ProjectParticipant__c(where: {Acc_ProjectId__c: {eq: $projectId}}, orderBy: {Acc_AccountId__r: {Name: {order: ASC}}}, first: 200) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__c {\n                value\n              }\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {LastModifiedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    isOwner\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      Description {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      FileType {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      LastModifiedDate {\n                        value\n                      }\n                      CreatedBy {\n                        Id\n                        Name {\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(first: 1, where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {LastModifiedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    isFeedAttachment\n                    isOwner\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      Description {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      FileType {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      LastModifiedDate {\n                        value\n                      }\n                      CreatedBy {\n                        Id\n                        Name {\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "9de5f793cc333cc334ba8e0660dc3392";

export default node;
