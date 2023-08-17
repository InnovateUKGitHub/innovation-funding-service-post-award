/**
 * @generated SignedSource<<6b111796630294f6a26b40dcd99e955e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ClaimReviewQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null;
};
export type ClaimReviewQuery$data = {
  readonly currentUser: {
    readonly email: string | null;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Claims__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ApprovedDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ClaimStatus__c: {
                readonly label: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_IARRequired__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_IAR_Status__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_PCF_Status__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_PaidDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_PeriodCostCategoryTotal__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectParticipant__r: {
                readonly Acc_AccountId__r: {
                  readonly Name: {
                    readonly value: string | null;
                  } | null;
                } | null;
                readonly Id: string;
              } | null;
              readonly Acc_ProjectPeriodCost__c: {
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
              readonly Acc_TotalCostsApproved__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalCostsSubmitted__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalDeferredAmount__c: {
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
              readonly LastModifiedDate: {
                readonly value: string | null;
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
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AccountId__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_AccountId__r: {
                readonly Name: {
                  readonly value: string | null;
                } | null;
              } | null;
              readonly Acc_ForecastLastModifiedDate__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_Overdue_Project__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_OverheadRate__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ParticipantStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectRole__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_TotalCostsSubmitted__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalFutureForecastsForParticipant__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalParticipantCosts__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalParticipantGrant__c: {
                readonly value: number | null;
              } | null;
              readonly Id: string;
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimFrequency__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ClaimsOverdue__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ClaimsUnderQuery__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_CompetitionId__r: {
                readonly Name: {
                  readonly value: string | null;
                } | null;
              } | null;
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_GOLTotalCostAwarded__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
              readonly Impact_Management_Participation__c: {
                readonly value: string | null;
              } | null;
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
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_StatusChange__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CreatedByAlias__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ExternalComment__c: {
                readonly value: any | null;
              } | null;
              readonly Acc_NewClaimStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ParticipantVisibility__c: {
                readonly value: boolean | null;
              } | null;
              readonly CreatedDate: {
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
export type ClaimReviewQuery = {
  response: ClaimReviewQuery$data;
  variables: ClaimReviewQuery$variables;
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
  "name": "periodId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectIdStr"
},
v4 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v5 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v6 = [
  {
    "fields": (v5/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectParticipant__c"
  }
],
v7 = {
  "fields": (v6/*: any*/),
  "kind": "ObjectValue",
  "name": "and.0"
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v10 = [
  (v9/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v16 = [
  (v15/*: any*/)
],
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "RecordType",
  "kind": "LinkedField",
  "name": "RecordType",
  "plural": false,
  "selections": (v16/*: any*/),
  "storageKey": null
},
v18 = {
  "CreatedDate": {
    "order": "DESC"
  }
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "DateTimeValue",
  "kind": "LinkedField",
  "name": "CreatedDate",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "Account",
  "kind": "LinkedField",
  "name": "Acc_AccountId__r",
  "plural": false,
  "selections": (v16/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_TotalCostsSubmitted__c",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v22 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v26 = [
  {
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
      }
    ],
    "storageKey": null
  },
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
                  (v4/*: any*/),
                  {
                    "fields": [
                      {
                        "items": [
                          (v7/*: any*/),
                          {
                            "kind": "Literal",
                            "name": "and.1",
                            "value": {
                              "or": [
                                {
                                  "RecordType": {
                                    "Name": {
                                      "eq": "Profile Detail"
                                    }
                                  }
                                },
                                {
                                  "RecordType": {
                                    "Name": {
                                      "eq": "Total Cost Category"
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          {
                            "kind": "Literal",
                            "name": "and.2",
                            "value": {
                              "Acc_CostCategory__c": {
                                "ne": null
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
                          (v8/*: any*/),
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryGOLCost__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_LatestForecastCost__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v17/*: any*/)
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
                  (v4/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": (v18/*: any*/)
                  },
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "items": [
                              (v7/*: any*/),
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
                                "name": "and.1"
                              }
                            ],
                            "kind": "ListValue",
                            "name": "and"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "Acc_Claim__r"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_StatusChange__cConnection",
                "kind": "LinkedField",
                "name": "Acc_StatusChange__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_StatusChange__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_StatusChange__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewClaimStatus__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_ExternalComment__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_ParticipantVisibility__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CreatedByAlias__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v19/*: any*/)
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
                  (v4/*: any*/),
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
                            "fields": (v6/*: any*/),
                            "kind": "ObjectValue",
                            "name": "and.1"
                          },
                          {
                            "kind": "Literal",
                            "name": "and.2",
                            "value": {
                              "or": [
                                {
                                  "RecordType": {
                                    "Name": {
                                      "eq": "Total Project Period"
                                    }
                                  }
                                },
                                {
                                  "RecordType": {
                                    "Name": {
                                      "eq": "Claims Detail"
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
                          (v8/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_ProjectParticipant__c",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectParticipant__r",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v20/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateTimeValue",
                            "kind": "LinkedField",
                            "name": "LastModifiedDate",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_ApprovedDate__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimStatus__c",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
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
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_IAR_Status__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_IARRequired__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_PaidDate__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_PeriodCostCategoryTotal__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v14/*: any*/),
                          (v13/*: any*/),
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectPeriodCost__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalCostsApproved__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v21/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalDeferredAmount__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_FinalClaim__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_PCF_Status__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": [
                              (v4/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "orderBy",
                                "value": {
                                  "ContentDocument": (v18/*: any*/)
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
                                      (v8/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "LinkedEntityId",
                                        "plural": false,
                                        "selections": (v10/*: any*/),
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
                                          (v8/*: any*/),
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
                                                "selections": (v10/*: any*/),
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
                                            "selections": (v10/*: any*/),
                                            "storageKey": null
                                          },
                                          (v19/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IDValue",
                                            "kind": "LinkedField",
                                            "name": "LatestPublishedVersionId",
                                            "plural": false,
                                            "selections": (v10/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "FileExtension",
                                            "plural": false,
                                            "selections": (v10/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Title",
                                            "plural": false,
                                            "selections": (v10/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IntValue",
                                            "kind": "LinkedField",
                                            "name": "ContentSize",
                                            "plural": false,
                                            "selections": (v10/*: any*/),
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
                                              (v15/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "StringValue",
                                                "kind": "LinkedField",
                                                "name": "Username",
                                                "plural": false,
                                                "selections": (v10/*: any*/),
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
              },
              {
                "alias": null,
                "args": [
                  (v4/*: any*/)
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
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryName__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_DisplayOrder__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_OrganisationType__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
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
                "alias": null,
                "args": [
                  (v4/*: any*/),
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": [
                              {
                                "fields": (v22/*: any*/),
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectId__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.0"
                          },
                          {
                            "fields": [
                              {
                                "fields": (v5/*: any*/),
                                "kind": "ObjectValue",
                                "name": "Id"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.1"
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
                          (v8/*: any*/),
                          (v20/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_AccountId__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalParticipantGrant__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectRole__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateTimeValue",
                            "kind": "LinkedField",
                            "name": "Acc_ForecastLastModifiedDate__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_OrganisationType__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ParticipantStatus__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalFutureForecastsForParticipant__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalParticipantCosts__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v21/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_Overdue_Project__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_OverheadRate__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
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
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1
                  },
                  {
                    "fields": [
                      {
                        "fields": (v22/*: any*/),
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
                          (v8/*: any*/),
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
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v25/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Partner_Roles",
                                "kind": "LinkedField",
                                "name": "partnerRoles",
                                "plural": true,
                                "selections": [
                                  (v23/*: any*/),
                                  (v24/*: any*/),
                                  (v25/*: any*/),
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
                            "concreteType": "Competition__c",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionId__r",
                            "plural": false,
                            "selections": (v16/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Impact_Management_Participation__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_NumberofPeriods__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodNumber__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimsUnderQuery__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimFrequency__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_GOLTotalCostAwarded__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ClaimsOverdue__c",
                            "plural": false,
                            "selections": (v10/*: any*/),
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
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimReviewQuery",
    "selections": (v26/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClaimReviewQuery",
    "selections": (v26/*: any*/)
  },
  "params": {
    "cacheID": "46e0866dbc4640e4d6fd89ba46b76388",
    "id": null,
    "metadata": {},
    "name": "ClaimReviewQuery",
    "operationKind": "query",
    "text": "query ClaimReviewQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    email\n  }\n  salesforce {\n    uiapi {\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: \"Profile Detail\"}}}, {RecordType: {Name: {eq: \"Total Cost Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_NewClaimStatus__c {\n                value\n              }\n              Acc_ExternalComment__c {\n                value\n              }\n              Acc_ParticipantVisibility__c {\n                value\n              }\n              Acc_CreatedByAlias__c {\n                value\n              }\n              CreatedDate {\n                value\n              }\n            }\n          }\n        }\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: \"Total Project Period\"}}}, {RecordType: {Name: {eq: \"Claims Detail\"}}}]}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_ProjectParticipant__r {\n                Id\n                Acc_AccountId__r {\n                  Name {\n                    value\n                  }\n                }\n              }\n              LastModifiedDate {\n                value\n              }\n              Acc_ApprovedDate__c {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_IAR_Status__c {\n                value\n              }\n              Acc_IARRequired__c {\n                value\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n              Acc_TotalCostsApproved__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_TotalDeferredAmount__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_PCF_Status__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Username {\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountId__c {\n                value\n              }\n              Acc_TotalParticipantGrant__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_ForecastLastModifiedDate__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n              Acc_TotalFutureForecastsForParticipant__c {\n                value\n              }\n              Acc_TotalParticipantCosts__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_Overdue_Project__c {\n                value\n              }\n              Acc_OverheadRate__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_CompetitionId__r {\n                Name {\n                  value\n                }\n              }\n              Impact_Management_Participation__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ClaimsUnderQuery__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_ClaimFrequency__c {\n                value\n              }\n              Acc_GOLTotalCostAwarded__c {\n                value\n              }\n              Acc_ClaimsOverdue__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3757062a8de8f938a9e60b159b377f8a";

export default node;
