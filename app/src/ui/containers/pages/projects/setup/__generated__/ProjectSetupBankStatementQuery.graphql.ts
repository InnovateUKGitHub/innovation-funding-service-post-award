/**
 * @generated SignedSource<<ec0e2293e89d2981f6b4940e44210175>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectSetupBankStatementQuery$variables = {
  partnerId: string;
  projectId: string;
};
export type ProjectSetupBankStatementQuery$data = {
  readonly currentUser: {
    readonly userId: string | null | undefined;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Id: string;
              readonly isActive: boolean;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"ProjectDocumentViewFragment" | "TitleFragment">;
    };
  };
};
export type ProjectSetupBankStatementQuery = {
  response: ProjectSetupBankStatementQuery$data;
  variables: ProjectSetupBankStatementQuery$variables;
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
  "name": "projectId"
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrentUserObject",
  "kind": "LinkedField",
  "name": "currentUser",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "userId",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v3 = {
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
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isActive",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": [
    (v3/*: any*/)
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
            (v4/*: any*/),
            (v5/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v3/*: any*/)
],
v8 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v13 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectSetupBankStatementQuery",
    "selections": [
      (v2/*: any*/),
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "TitleFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ProjectDocumentViewFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v6/*: any*/)
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
    "name": "ProjectSetupBankStatementQuery",
    "selections": [
      (v2/*: any*/),
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
                    "alias": "Title_Project",
                    "args": (v7/*: any*/),
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
                    "alias": "ProjectDocumentView_Project",
                    "args": (v7/*: any*/),
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
                              (v4/*: any*/),
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v9/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v12/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      (v11/*: any*/),
                                      (v12/*: any*/),
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
                  },
                  {
                    "alias": "ProjectDocumentView_Partner",
                    "args": [
                      (v13/*: any*/),
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
                            "name": "Id"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "where"
                      }
                    ],
                    "concreteType": "Acc_ProjectParticipant__cConnection",
                    "kind": "LinkedField",
                    "name": "Acc_ProjectParticipant__c",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_ProjectParticipant__cEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_ProjectParticipant__c",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Account",
                                "kind": "LinkedField",
                                "name": "Acc_AccountId__r",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "IDValue",
                                "kind": "LinkedField",
                                "name": "Acc_AccountId__c",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": [
                                  (v13/*: any*/),
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
                                            "selections": (v8/*: any*/),
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
                                              (v4/*: any*/),
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
                                                "concreteType": "StringValue",
                                                "kind": "LinkedField",
                                                "name": "FileType",
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
                                                "concreteType": "DateTimeValue",
                                                "kind": "LinkedField",
                                                "name": "LastModifiedDate",
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
                                                  (v4/*: any*/),
                                                  (v14/*: any*/)
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
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "dc61f3c5aea7070d8c0428f29b892b04",
    "id": null,
    "metadata": {},
    "name": "ProjectSetupBankStatementQuery",
    "operationKind": "query",
    "text": "query ProjectSetupBankStatementQuery(\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  currentUser {\n    userId\n  }\n  salesforce {\n    uiapi {\n      ...TitleFragment\n      ...ProjectDocumentViewFragment\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectDocumentViewFragment on UIAPI {\n  query {\n    ProjectDocumentView_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              partnerId\n            }\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n        }\n      }\n    }\n    ProjectDocumentView_Partner: Acc_ProjectParticipant__c(where: {Id: {eq: $partnerId}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_AccountId__c {\n            value\n          }\n          ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {LastModifiedDate: {order: DESC}}}) {\n            edges {\n              node {\n                isFeedAttachment\n                isOwner\n                LinkedEntityId {\n                  value\n                }\n                ContentDocument {\n                  Id\n                  LastModifiedBy {\n                    ContactId {\n                      value\n                    }\n                  }\n                  LatestPublishedVersionId {\n                    value\n                  }\n                  Description {\n                    value\n                  }\n                  ContentSize {\n                    value\n                  }\n                  CreatedDate {\n                    value\n                  }\n                  FileType {\n                    value\n                  }\n                  FileExtension {\n                    value\n                  }\n                  Title {\n                    value\n                  }\n                  LastModifiedDate {\n                    value\n                  }\n                  CreatedBy {\n                    Id\n                    Name {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "783e6a29fdaf635e194b851ea8f16253";

export default node;
