/**
 * @generated SignedSource<<928964cca504ff022c4b0f9dec94b5be>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EditClaimLineItemsQuery$variables = {
  costCategoryId: CostCategoryId;
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null;
};
export type EditClaimLineItemsQuery$data = {
  readonly currentUser: {
    readonly email: string | null;
    readonly isSystemUser: boolean;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Claims__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly label: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_LineItemCost__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_LineItemDescription__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ReasonForDifference__c: {
                readonly value: any | null;
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
                    readonly LinkedEntityId: {
                      readonly value: string | null;
                    } | null;
                    readonly isFeedAttachment: boolean;
                  } | null;
                } | null> | null;
              } | null;
              readonly Id: string;
              readonly LastModifiedDate: {
                readonly value: string | null;
              } | null;
              readonly Owner: {
                readonly Email?: {
                  readonly value: string | null;
                } | null;
              } | null;
              readonly RecordType: {
                readonly Name: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_CostCategory__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CostCategoryName__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_DisplayOrder__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_Profile__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategoryGOLCost__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_LatestForecastCost__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectPeriodEndDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectPeriodStartDate__c: {
                readonly value: string | null;
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
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_NonFEC__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type EditClaimLineItemsQuery = {
  response: EditClaimLineItemsQuery$data;
  variables: EditClaimLineItemsQuery$variables;
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
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSystemUser",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v7 = [
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
v8 = [
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
v9 = {
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
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v12 = [
  (v11/*: any*/)
],
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "RecordType",
  "kind": "LinkedField",
  "name": "RecordType",
  "plural": false,
  "selections": [
    (v14/*: any*/)
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": [
    (v6/*: any*/),
    {
      "fields": [
        {
          "items": [
            {
              "fields": (v7/*: any*/),
              "kind": "ObjectValue",
              "name": "and.0"
            },
            {
              "fields": (v8/*: any*/),
              "kind": "ObjectValue",
              "name": "and.1"
            },
            {
              "kind": "Literal",
              "name": "and.2",
              "value": {
                "RecordType": {
                  "Name": {
                    "eq": "Profile Detail"
                  }
                }
              }
            },
            (v9/*: any*/)
          ],
          "kind": "ListValue",
          "name": "and"
        }
      ],
      "kind": "ObjectValue",
      "name": "where"
    }
  ],
  "concreteType": "Acc_Profile__cConnection",
  "kind": "LinkedField",
  "name": "Acc_Profile__c",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Acc_Profile__cEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Acc_Profile__c",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v10/*: any*/),
            (v13/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_CostCategoryGOLCost__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodNumber__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodStartDate__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodEndDate__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_LatestForecastCost__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            (v15/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = [
  (v6/*: any*/),
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
            "fields": (v7/*: any*/),
            "kind": "ObjectValue",
            "name": "and.1"
          },
          {
            "fields": (v8/*: any*/),
            "kind": "ObjectValue",
            "name": "and.2"
          },
          (v9/*: any*/),
          {
            "kind": "Literal",
            "name": "and.4",
            "value": {
              "or": [
                {
                  "RecordType": {
                    "Name": {
                      "eq": "Claims Detail"
                    }
                  }
                },
                {
                  "RecordType": {
                    "Name": {
                      "eq": "Claims Line Item"
                    }
                  }
                }
              ]
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
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_LineItemDescription__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_LineItemCost__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectParticipant__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "LongTextAreaValue",
  "kind": "LinkedField",
  "name": "Acc_ReasonForDifference__c",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v22 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "EmailValue",
      "kind": "LinkedField",
      "name": "Email",
      "plural": false,
      "selections": (v12/*: any*/),
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "DateTimeValue",
  "kind": "LinkedField",
  "name": "LastModifiedDate",
  "plural": false,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ClaimStatus__c",
  "plural": false,
  "selections": [
    (v11/*: any*/),
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
v25 = {
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
              "selections": (v12/*: any*/),
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
                (v10/*: any*/),
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
                      "selections": (v12/*: any*/),
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "DateTimeValue",
                  "kind": "LinkedField",
                  "name": "CreatedDate",
                  "plural": false,
                  "selections": (v12/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "IDValue",
                  "kind": "LinkedField",
                  "name": "LatestPublishedVersionId",
                  "plural": false,
                  "selections": (v12/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "FileExtension",
                  "plural": false,
                  "selections": (v12/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Title",
                  "plural": false,
                  "selections": (v12/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "IntValue",
                  "kind": "LinkedField",
                  "name": "ContentSize",
                  "plural": false,
                  "selections": (v12/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "LongTextAreaValue",
                  "kind": "LinkedField",
                  "name": "Description",
                  "plural": false,
                  "selections": (v12/*: any*/),
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
                    (v14/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Username",
                      "plural": false,
                      "selections": (v12/*: any*/),
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
},
v26 = {
  "alias": null,
  "args": [
    (v6/*: any*/)
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
            (v10/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_CostCategoryName__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_DisplayOrder__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_OrganisationType__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_CompetitionType__c",
              "plural": false,
              "selections": (v12/*: any*/),
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
v27 = {
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
            (v10/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_NonFEC__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectNumber__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectTitle__c",
              "plural": false,
              "selections": (v12/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_CompetitionType__c",
              "plural": false,
              "selections": (v12/*: any*/),
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
};
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
    "name": "EditClaimLineItemsQuery",
    "selections": [
      (v5/*: any*/),
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
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": (v17/*: any*/),
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
                              (v10/*: any*/),
                              (v15/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v20/*: any*/),
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "Owner",
                                "plural": false,
                                "selections": [
                                  (v22/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v13/*: any*/),
                              (v25/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v26/*: any*/),
                  (v27/*: any*/)
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
      (v3/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditClaimLineItemsQuery",
    "selections": [
      (v5/*: any*/),
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
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": (v17/*: any*/),
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
                              (v10/*: any*/),
                              (v15/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v20/*: any*/),
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "Owner",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "__typename",
                                    "storageKey": null
                                  },
                                  (v22/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v13/*: any*/),
                              (v25/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v26/*: any*/),
                  (v27/*: any*/)
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
    "cacheID": "9c984a9d49905cabc046606f2d2f97b2",
    "id": null,
    "metadata": {},
    "name": "EditClaimLineItemsQuery",
    "operationKind": "query",
    "text": "query EditClaimLineItemsQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n  $costCategoryId: ID!\n) {\n  currentUser {\n    email\n    isSystemUser\n  }\n  salesforce {\n    uiapi {\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: \"Profile Detail\"}}}, {Acc_CostCategory__c: {eq: $costCategoryId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {Acc_CostCategory__c: {eq: $costCategoryId}}, {or: [{RecordType: {Name: {eq: \"Claims Detail\"}}}, {RecordType: {Name: {eq: \"Claims Line Item\"}}}]}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_ClaimStatus__c: {ne: \"Not used\"}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_LineItemDescription__c {\n                value\n              }\n              Acc_LineItemCost__c {\n                value\n              }\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_ReasonForDifference__c {\n                value\n              }\n              Owner {\n                __typename\n                ... on User {\n                  Email {\n                    value\n                  }\n                }\n              }\n              LastModifiedDate {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Username {\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              Acc_NonFEC__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6b832f426ad52f35cf226c201f91b0ef";

export default node;
