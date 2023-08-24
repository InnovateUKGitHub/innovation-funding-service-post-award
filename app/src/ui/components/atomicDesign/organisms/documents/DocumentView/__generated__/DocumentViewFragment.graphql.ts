/**
 * @generated SignedSource<<60fbe10e9c2f38ccdeca42a71130b922>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DocumentViewFragment$data = {
  readonly query: {
    readonly DocumentView_Claims: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategory__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null;
          } | null;
          readonly ContentDocumentLinks: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly ContentDocument: {
                  readonly ContentSize: {
                    readonly value: number | null;
                  } | null;
                  readonly CreatedBy: {
                    readonly Name: {
                      readonly value: string | null;
                    } | null;
                    readonly Username: {
                      readonly value: string | null;
                    } | null;
                  } | null;
                  readonly CreatedDate: {
                    readonly value: string | null;
                  } | null;
                  readonly Description: {
                    readonly value: any | null;
                  } | null;
                  readonly FileExtension: {
                    readonly value: string | null;
                  } | null;
                  readonly Id: string;
                  readonly LastModifiedBy: {
                    readonly ContactId: {
                      readonly value: string | null;
                    } | null;
                  } | null;
                  readonly LatestPublishedVersionId: {
                    readonly value: string | null;
                  } | null;
                  readonly Title: {
                    readonly value: string | null;
                  } | null;
                } | null;
                readonly Id: string;
                readonly LinkedEntityId: {
                  readonly value: string | null;
                } | null;
                readonly isFeedAttachment: boolean;
              } | null;
            } | null> | null;
          } | null;
          readonly Id: string;
          readonly RecordType: {
            readonly Name: {
              readonly value: string | null;
            } | null;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  };
  readonly " $fragmentType": "DocumentViewFragment";
};
export type DocumentViewFragment$key = {
  readonly " $data"?: DocumentViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DocumentViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
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
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "documentRecordType"
    },
    {
      "kind": "RootArgument",
      "name": "partnerId"
    },
    {
      "kind": "RootArgument",
      "name": "projectIdStr"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "DocumentViewFragment",
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
          "alias": "DocumentView_Claims",
          "args": [
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "orderBy",
              "value": {
                "Acc_ProjectParticipant__r": {
                  "Acc_AccountId__r": {
                    "Name": {
                      "order": "ASC"
                    }
                  }
                }
              }
            },
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
                              "fields": [
                                {
                                  "kind": "Variable",
                                  "name": "eq",
                                  "variableName": "documentRecordType"
                                }
                              ],
                              "kind": "ObjectValue",
                              "name": "Name"
                            }
                          ],
                          "kind": "ObjectValue",
                          "name": "RecordType"
                        }
                      ],
                      "kind": "ObjectValue",
                      "name": "and.2"
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
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodNumber__c",
                      "plural": false,
                      "selections": (v2/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "IDValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__c",
                      "plural": false,
                      "selections": (v2/*: any*/),
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
                        (v3/*: any*/)
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": [
                        (v0/*: any*/),
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
                                (v1/*: any*/),
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "IDValue",
                                  "kind": "LinkedField",
                                  "name": "LinkedEntityId",
                                  "plural": false,
                                  "selections": (v2/*: any*/),
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
                                  "concreteType": "ContentDocument",
                                  "kind": "LinkedField",
                                  "name": "ContentDocument",
                                  "plural": false,
                                  "selections": [
                                    (v1/*: any*/),
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
                                        (v3/*: any*/),
                                        {
                                          "alias": null,
                                          "args": null,
                                          "concreteType": "StringValue",
                                          "kind": "LinkedField",
                                          "name": "Username",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "4acc303c80f4e9180f0f83d8b0253e4b";

export default node;
