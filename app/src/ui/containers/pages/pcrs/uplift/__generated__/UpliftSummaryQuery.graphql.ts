/**
 * @generated SignedSource<<54240128b76c635aa87af891ebd129ee>>
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
  projectId: string;
};
export type UpliftSummaryQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Profile__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategoryAwardOverride__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategoryGOLCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategory__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategory__r: {
                readonly Acc_CostCategoryName__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_LatestForecastCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OverrideAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProfileOverrideAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodStartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AccountId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectRole__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_VirementsForCosts: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimedCostsToDate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ParticipantVirement__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Profile__r: {
                readonly Acc_CostCategory__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_VirementsForParticipant: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CurrentAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewAwardRate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewRemainingGrant__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewTotalEligibleCosts__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectChangeRequest__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Child: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Override_Justification__c: {
                readonly value: string | null | undefined;
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
              readonly LinkedEntityId: {
                readonly value: string | null | undefined;
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
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrItemId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
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
v5 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrItemId"
  }
],
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v9 = {
  "fields": (v5/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_ProjectChangeRequest__c"
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectParticipant__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v12 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "eq",
        "variableName": "projectId"
      }
    ],
    "kind": "ObjectValue",
    "name": "Acc_ProjectId__c"
  }
],
v13 = [
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
                  (v3/*: any*/),
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
                "alias": "Child",
                "args": [
                  (v3/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": (v5/*: any*/),
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
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Override_Justification__c",
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
                "alias": "Documents",
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
                              (v7/*: any*/),
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
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "CreatedBy",
                                "plural": false,
                                "selections": [
                                  (v8/*: any*/),
                                  (v7/*: any*/)
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
              },
              {
                "alias": "Acc_VirementsForParticipant",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 200
                  },
                  {
                    "fields": [
                      (v9/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "RecordType",
                        "value": {
                          "DeveloperName": {
                            "eq": "Acc_VirementsForParticipant"
                          }
                        }
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_Virements__cConnection",
                "kind": "LinkedField",
                "name": "Acc_Virements__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_Virements__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Virements__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectChangeRequest__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewAwardRate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentAwardRate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewTotalEligibleCosts__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewRemainingGrant__c",
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
                "alias": "Acc_VirementsForCosts",
                "args": [
                  (v6/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": [
                          (v9/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "Acc_ParticipantVirement__r"
                      },
                      {
                        "kind": "Literal",
                        "name": "RecordType",
                        "value": {
                          "DeveloperName": {
                            "eq": "Acc_VirementsForCosts"
                          }
                        }
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_Virements__cConnection",
                "kind": "LinkedField",
                "name": "Acc_Virements__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_Virements__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_Virements__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_Profile__c",
                            "kind": "LinkedField",
                            "name": "Acc_Profile__r",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_ParticipantVirement__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentCosts__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimedCostsToDate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewCosts__c",
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
                "alias": null,
                "args": [
                  (v6/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_AccountId__r": {
                        "Name": {
                          "order": "ASC"
                        }
                      }
                    }
                  },
                  {
                    "fields": (v12/*: any*/),
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
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Account",
                            "kind": "LinkedField",
                            "name": "Acc_AccountId__r",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectRole__c",
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
                "alias": null,
                "args": [
                  (v6/*: any*/),
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": [
                              {
                                "fields": (v12/*: any*/),
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectParticipant__r"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.0"
                          },
                          {
                            "kind": "Literal",
                            "name": "and.1",
                            "value": {
                              "or": [
                                {
                                  "RecordType": {
                                    "DeveloperName": {
                                      "eq": "Total_Project_Period"
                                    }
                                  }
                                },
                                {
                                  "RecordType": {
                                    "DeveloperName": {
                                      "eq": "Total_Cost_Category"
                                    }
                                  }
                                }
                              ]
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
                          (v7/*: any*/),
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_CostCategory__c",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategory__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_CostCategoryName__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryGOLCost__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_OverrideAwardRate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectPeriodNumber__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProfileOverrideAwardRate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryAwardOverride__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectPeriodStartDate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectPeriodEndDate__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_LatestForecastCost__c",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpliftSummaryQuery",
    "selections": (v13/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpliftSummaryQuery",
    "selections": (v13/*: any*/)
  },
  "params": {
    "cacheID": "ec8a412f691a60594d32f9c73ec8704c",
    "id": null,
    "metadata": {},
    "name": "UpliftSummaryQuery",
    "operationKind": "query",
    "text": "query UpliftSummaryQuery(\n  $projectId: ID!\n  $pcrId: ID!\n  $pcrItemId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Header: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrId}}, first: 1) {\n          edges {\n            node {\n              Acc_RequestNumber__c {\n                value\n              }\n            }\n          }\n        }\n        Child: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrItemId}}, first: 1) {\n          edges {\n            node {\n              Override_Justification__c {\n                value\n              }\n            }\n          }\n        }\n        Documents: ContentDocumentLink(where: {LinkedEntityId: {in: [$pcrId, $pcrItemId]}}, first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n          edges {\n            node {\n              isFeedAttachment\n              isOwner\n              LinkedEntityId {\n                value\n              }\n              ContentDocument {\n                Id\n                LastModifiedBy {\n                  ContactId {\n                    value\n                  }\n                }\n                Description {\n                  value\n                }\n                CreatedDate {\n                  value\n                }\n                LatestPublishedVersionId {\n                  value\n                }\n                FileExtension {\n                  value\n                }\n                Title {\n                  value\n                }\n                ContentSize {\n                  value\n                }\n                CreatedBy {\n                  Name {\n                    value\n                  }\n                  Id\n                }\n              }\n            }\n          }\n        }\n        Acc_VirementsForParticipant: Acc_Virements__c(where: {Acc_ProjectChangeRequest__c: {eq: $pcrItemId}, RecordType: {DeveloperName: {eq: \"Acc_VirementsForParticipant\"}}}, first: 200) {\n          edges {\n            node {\n              Id\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_ProjectChangeRequest__c {\n                value\n              }\n              Acc_NewAwardRate__c {\n                value\n              }\n              Acc_CurrentAwardRate__c {\n                value\n              }\n              Acc_NewTotalEligibleCosts__c {\n                value\n              }\n              Acc_NewRemainingGrant__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_VirementsForCosts: Acc_Virements__c(where: {Acc_ParticipantVirement__r: {Acc_ProjectChangeRequest__c: {eq: $pcrItemId}}, RecordType: {DeveloperName: {eq: \"Acc_VirementsForCosts\"}}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_Profile__r {\n                Id\n                Acc_CostCategory__c {\n                  value\n                }\n              }\n              Acc_ParticipantVirement__c {\n                value\n              }\n              Acc_CurrentCosts__c {\n                value\n              }\n              Acc_ClaimedCostsToDate__c {\n                value\n              }\n              Acc_NewCosts__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {Acc_ProjectId__c: {eq: $projectId}}, orderBy: {Acc_AccountId__r: {Name: {order: ASC}}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__r: {Acc_ProjectId__c: {eq: $projectId}}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategory__r {\n                Acc_CostCategoryName__c {\n                  value\n                }\n              }\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_OverrideAwardRate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProfileOverrideAwardRate__c {\n                value\n              }\n              Acc_CostCategoryAwardOverride__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c95c726abfa5681fbcc965e9fecd5187";

export default node;
