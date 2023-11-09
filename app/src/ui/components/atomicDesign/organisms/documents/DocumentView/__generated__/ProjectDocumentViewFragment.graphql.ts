/**
 * @generated SignedSource<<f7c468e4f09c3967595ae83d186b49cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDocumentViewFragment$data = {
  readonly query: {
    readonly ProjectDocumentView_Partner: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_AccountId__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_AccountId__r: {
            readonly Name: {
              readonly value: string | null | undefined;
            } | null | undefined;
          } | null | undefined;
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
    readonly ProjectDocumentView_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ProjectStatus__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Id: string;
          readonly isActive: boolean;
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
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "ProjectDocumentViewFragment";
};
export type ProjectDocumentViewFragment$key = {
  readonly " $data"?: ProjectDocumentViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectDocumentViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "partnerId"
    },
    {
      "kind": "RootArgument",
      "name": "projectId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectDocumentViewFragment",
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
          "alias": "ProjectDocumentView_Project",
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
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isActive",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Ext_Project_Roles",
                      "kind": "LinkedField",
                      "name": "roles",
                      "plural": false,
                      "selections": [
                        (v1/*: any*/),
                        (v2/*: any*/),
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Ext_Partner_Roles",
                          "kind": "LinkedField",
                          "name": "partnerRoles",
                          "plural": true,
                          "selections": [
                            (v1/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/),
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
        },
        {
          "alias": "ProjectDocumentView_Partner",
          "args": [
            (v5/*: any*/),
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
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Account",
                      "kind": "LinkedField",
                      "name": "Acc_AccountId__r",
                      "plural": false,
                      "selections": [
                        (v6/*: any*/)
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
                      "selections": (v4/*: any*/),
                      "storageKey": null
                    },
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
                                  "selections": (v4/*: any*/),
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
                                    (v0/*: any*/),
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
                                          "selections": (v4/*: any*/),
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
                                      "selections": (v4/*: any*/),
                                      "storageKey": null
                                    },
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "LongTextAreaValue",
                                      "kind": "LinkedField",
                                      "name": "Description",
                                      "plural": false,
                                      "selections": (v4/*: any*/),
                                      "storageKey": null
                                    },
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "IntValue",
                                      "kind": "LinkedField",
                                      "name": "ContentSize",
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
                                      "concreteType": "StringValue",
                                      "kind": "LinkedField",
                                      "name": "FileType",
                                      "plural": false,
                                      "selections": (v4/*: any*/),
                                      "storageKey": null
                                    },
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "StringValue",
                                      "kind": "LinkedField",
                                      "name": "FileExtension",
                                      "plural": false,
                                      "selections": (v4/*: any*/),
                                      "storageKey": null
                                    },
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "StringValue",
                                      "kind": "LinkedField",
                                      "name": "Title",
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
                                      "concreteType": "User",
                                      "kind": "LinkedField",
                                      "name": "CreatedBy",
                                      "plural": false,
                                      "selections": [
                                        (v0/*: any*/),
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "3699a155abe44d13ad841ab956d7c45c";

export default node;
