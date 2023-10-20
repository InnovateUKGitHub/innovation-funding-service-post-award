/**
 * @generated SignedSource<<42cbab3904830df743d51b17fbd78742>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClaimSummaryQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null;
};
export type ClaimSummaryQuery$data = {
  readonly currentUser: {
    readonly userId: string | null;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
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
                readonly DeveloperName: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Award_Rate__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalApprovedCosts__c: {
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
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_MonitoringLevel__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_NonFEC__c: {
                readonly value: boolean | null;
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
        readonly ClaimDetails: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_PeriodCostCategoryTotal__c: {
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
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
        readonly ClaimForPartner: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_IARRequired__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_PCF_Status__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectParticipant__c: {
                readonly value: string | null;
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
              readonly Acc_ReasonForDifference__c: {
                readonly value: any | null;
              } | null;
              readonly Id: string;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
        readonly ClaimsByPeriodForDocuments: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly ContentDocumentLinks: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly ContentDocument: {
                      readonly ContentSize: {
                        readonly value: number | null;
                      } | null;
                      readonly CreatedBy: {
                        readonly Id: string;
                        readonly Name: {
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
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null;
                } | null;
                readonly Name: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
      };
      readonly " $fragmentSpreads": FragmentRefs<"AwardRateOverridesMessageFragment" | "StatusChangesLogsFragment" | "TitleFragment" | "TotalCostsClaimedFragment">;
    };
  };
};
export type ClaimSummaryQuery = {
  response: ClaimSummaryQuery$data;
  variables: ClaimSummaryQuery$variables;
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
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v6 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v7 = [
  {
    "fields": (v6/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectParticipant__c"
  }
],
v8 = {
  "fields": (v7/*: any*/),
  "kind": "ObjectValue",
  "name": "and.0"
},
v9 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Cost_Category"
    }
  }
},
v10 = {
  "Acc_CostCategory__c": {
    "ne": null
  }
},
v11 = {
  "kind": "Literal",
  "name": "and.2",
  "value": (v10/*: any*/)
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v13 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryGOLCost__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_LatestForecastCost__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "DeveloperName",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "RecordType",
  "kind": "LinkedField",
  "name": "RecordType",
  "plural": false,
  "selections": [
    (v20/*: any*/)
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": [
    (v5/*: any*/),
    {
      "fields": [
        {
          "items": [
            (v8/*: any*/),
            {
              "kind": "Literal",
              "name": "and.1",
              "value": {
                "or": [
                  {
                    "RecordType": {
                      "DeveloperName": {
                        "eq": "Profile_Detail"
                      }
                    }
                  },
                  (v9/*: any*/)
                ]
              }
            },
            (v11/*: any*/)
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
            (v12/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v21/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v23 = [
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
v24 = {
  "fields": (v23/*: any*/),
  "kind": "ObjectValue",
  "name": "and.1"
},
v25 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Project_Period"
    }
  }
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ClaimStatus__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v27 = {
  "alias": "ClaimForPartner",
  "args": [
    (v5/*: any*/),
    {
      "fields": [
        {
          "items": [
            (v8/*: any*/),
            (v24/*: any*/),
            {
              "kind": "Literal",
              "name": "and.2",
              "value": (v25/*: any*/)
            },
            {
              "kind": "Literal",
              "name": "and.3",
              "value": {
                "Acc_ClaimStatus__c": {
                  "ne": "New "
                }
              }
            },
            {
              "kind": "Literal",
              "name": "and.4",
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
            (v21/*: any*/),
            (v12/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectParticipant__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            (v26/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_FinalClaim__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_IARRequired__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_PCF_Status__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            (v18/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "LongTextAreaValue",
              "kind": "LinkedField",
              "name": "Acc_ReasonForDifference__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectPeriodCost__c",
              "plural": false,
              "selections": (v13/*: any*/),
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
v28 = {
  "order": "ASC"
},
v29 = {
  "Acc_AccountId__r": {
    "Name": (v28/*: any*/)
  }
},
v30 = [
  (v5/*: any*/),
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": {
      "Acc_ProjectParticipant__r": (v29/*: any*/),
      "Acc_ProjectPeriodNumber__c": (v28/*: any*/)
    }
  },
  {
    "fields": [
      {
        "items": [
          (v8/*: any*/),
          {
            "kind": "Literal",
            "name": "and.1",
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
            "name": "and.2",
            "value": {
              "Acc_ClaimStatus__c": {
                "ne": "New"
              }
            }
          },
          {
            "kind": "Literal",
            "name": "and.3",
            "value": (v10/*: any*/)
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
v31 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_PeriodCostCategoryTotal__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v32 = {
  "alias": "ClaimDetails",
  "args": (v30/*: any*/),
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
            (v21/*: any*/),
            (v26/*: any*/),
            (v14/*: any*/),
            (v31/*: any*/),
            (v18/*: any*/),
            (v16/*: any*/),
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
v33 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v34 = {
  "CreatedDate": {
    "order": "DESC"
  }
},
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "DateTimeValue",
  "kind": "LinkedField",
  "name": "CreatedDate",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v36 = {
  "alias": "ClaimsByPeriodForDocuments",
  "args": [
    (v5/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_ProjectParticipant__r": (v29/*: any*/)
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
              "fields": (v7/*: any*/),
              "kind": "ObjectValue",
              "name": "and.1"
            },
            {
              "fields": (v23/*: any*/),
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
            {
              "alias": null,
              "args": null,
              "concreteType": "RecordType",
              "kind": "LinkedField",
              "name": "RecordType",
              "plural": false,
              "selections": [
                (v33/*: any*/),
                (v20/*: any*/)
              ],
              "storageKey": null
            },
            (v14/*: any*/),
            {
              "alias": null,
              "args": [
                (v5/*: any*/),
                {
                  "kind": "Literal",
                  "name": "orderBy",
                  "value": {
                    "ContentDocument": (v34/*: any*/)
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
                        (v12/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "IDValue",
                          "kind": "LinkedField",
                          "name": "LinkedEntityId",
                          "plural": false,
                          "selections": (v13/*: any*/),
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
                            (v12/*: any*/),
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
                                  "selections": (v13/*: any*/),
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
                              "selections": (v13/*: any*/),
                              "storageKey": null
                            },
                            (v35/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "IDValue",
                              "kind": "LinkedField",
                              "name": "LatestPublishedVersionId",
                              "plural": false,
                              "selections": (v13/*: any*/),
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "StringValue",
                              "kind": "LinkedField",
                              "name": "FileExtension",
                              "plural": false,
                              "selections": (v13/*: any*/),
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "StringValue",
                              "kind": "LinkedField",
                              "name": "Title",
                              "plural": false,
                              "selections": (v13/*: any*/),
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "IntValue",
                              "kind": "LinkedField",
                              "name": "ContentSize",
                              "plural": false,
                              "selections": (v13/*: any*/),
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
                                (v33/*: any*/),
                                (v12/*: any*/)
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
v37 = [
  (v5/*: any*/)
],
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_DisplayOrder__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_OrganisationType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": (v37/*: any*/),
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
            (v12/*: any*/),
            (v38/*: any*/),
            (v39/*: any*/),
            (v40/*: any*/),
            (v41/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "Acc_CostCategory__c(first:2000)"
},
v43 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v44 = [
  (v5/*: any*/),
  {
    "fields": [
      {
        "items": [
          {
            "fields": [
              {
                "fields": (v43/*: any*/),
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
                "fields": (v6/*: any*/),
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
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_Award_Rate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": (v44/*: any*/),
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
            (v12/*: any*/),
            (v45/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalParticipantGrant__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalFutureForecastsForParticipant__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalApprovedCosts__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "CurrencyValue",
              "kind": "LinkedField",
              "name": "Acc_TotalParticipantCosts__c",
              "plural": false,
              "selections": (v13/*: any*/),
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
v47 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  {
    "fields": [
      {
        "fields": (v43/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "concreteType": "BooleanValue",
  "kind": "LinkedField",
  "name": "Acc_NonFEC__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": (v47/*: any*/),
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
            (v12/*: any*/),
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
                (v48/*: any*/),
                (v49/*: any*/),
                (v50/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Ext_Partner_Roles",
                  "kind": "LinkedField",
                  "name": "partnerRoles",
                  "plural": true,
                  "selections": [
                    (v48/*: any*/),
                    (v49/*: any*/),
                    (v50/*: any*/),
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
              "name": "Impact_Management_Participation__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            (v51/*: any*/),
            (v52/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "PicklistValue",
              "kind": "LinkedField",
              "name": "Acc_MonitoringLevel__c",
              "plural": false,
              "selections": (v13/*: any*/),
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
v54 = {
  "alias": null,
  "args": null,
  "concreteType": "Acc_CostCategory__c",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__r",
  "plural": false,
  "selections": [
    (v38/*: any*/)
  ],
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_OverrideAwardRate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_ProfileOverrideAwardRate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
};
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
    "name": "ClaimSummaryQuery",
    "selections": [
      (v4/*: any*/),
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
                "name": "AwardRateOverridesMessageFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "StatusChangesLogsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TitleFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TotalCostsClaimedFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v22/*: any*/),
                  (v27/*: any*/),
                  (v32/*: any*/),
                  (v36/*: any*/),
                  (v42/*: any*/),
                  (v46/*: any*/),
                  (v53/*: any*/)
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClaimSummaryQuery",
    "selections": [
      (v4/*: any*/),
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
                    "alias": "AwardRateOverridesMessage_Project",
                    "args": (v47/*: any*/),
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
                              (v51/*: any*/)
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
                    "alias": "AwardRateOverridesMessage_Profile",
                    "args": [
                      (v5/*: any*/),
                      {
                        "fields": [
                          {
                            "items": [
                              (v8/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "and.1",
                                "value": {
                                  "or": [
                                    (v25/*: any*/),
                                    (v9/*: any*/)
                                  ]
                                }
                              },
                              (v11/*: any*/)
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
                              (v12/*: any*/),
                              (v14/*: any*/),
                              (v54/*: any*/),
                              (v15/*: any*/),
                              (v55/*: any*/),
                              (v16/*: any*/),
                              (v56/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v21/*: any*/)
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
                    "alias": "StatusChanges_Project",
                    "args": (v47/*: any*/),
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
                              (v12/*: any*/),
                              (v52/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v49/*: any*/),
                                  (v50/*: any*/),
                                  (v48/*: any*/)
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
                    "alias": "StatusChanges_StatusChanges",
                    "args": [
                      (v5/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "orderBy",
                        "value": (v34/*: any*/)
                      },
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "items": [
                                  (v8/*: any*/),
                                  (v24/*: any*/)
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
                              (v12/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "TextAreaValue",
                                "kind": "LinkedField",
                                "name": "Acc_NewClaimStatus__c",
                                "plural": false,
                                "selections": (v13/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "LongTextAreaValue",
                                "kind": "LinkedField",
                                "name": "Acc_ExternalComment__c",
                                "plural": false,
                                "selections": (v13/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BooleanValue",
                                "kind": "LinkedField",
                                "name": "Acc_ParticipantVisibility__c",
                                "plural": false,
                                "selections": (v13/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_CreatedByAlias__c",
                                "plural": false,
                                "selections": (v13/*: any*/),
                                "storageKey": null
                              },
                              (v35/*: any*/)
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
                    "alias": "Title_Project",
                    "args": (v47/*: any*/),
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
                                "selections": (v13/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v13/*: any*/),
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
                    "alias": "TotalCostsClaimed_ClaimDetails",
                    "args": (v30/*: any*/),
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
                              (v21/*: any*/),
                              (v14/*: any*/),
                              (v31/*: any*/),
                              (v16/*: any*/)
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
                    "alias": "TotalCostsClaimed_ClaimOverrides",
                    "args": [
                      (v5/*: any*/),
                      {
                        "fields": [
                          {
                            "items": [
                              (v8/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "and.1",
                                "value": (v9/*: any*/)
                              },
                              (v11/*: any*/)
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
                              (v12/*: any*/),
                              (v21/*: any*/),
                              (v14/*: any*/),
                              (v54/*: any*/),
                              (v15/*: any*/),
                              (v55/*: any*/),
                              (v16/*: any*/),
                              (v56/*: any*/)
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
                    "alias": "TotalCostsClaimed_CostCategory",
                    "args": (v37/*: any*/),
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
                              (v12/*: any*/),
                              (v38/*: any*/),
                              (v39/*: any*/),
                              (v40/*: any*/),
                              (v41/*: any*/),
                              (v55/*: any*/)
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
                    "alias": "TotalCostsClaimed_Partner",
                    "args": (v44/*: any*/),
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
                              (v12/*: any*/),
                              (v45/*: any*/)
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
                    "alias": "TotalCostsClaimed_Project",
                    "args": (v47/*: any*/),
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
                              (v12/*: any*/),
                              (v51/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/),
                  (v27/*: any*/),
                  (v32/*: any*/),
                  (v36/*: any*/),
                  (v42/*: any*/),
                  (v46/*: any*/),
                  (v53/*: any*/)
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
    "cacheID": "983c9588c57eac98a755d97621dcfe4f",
    "id": null,
    "metadata": {},
    "name": "ClaimSummaryQuery",
    "operationKind": "query",
    "text": "query ClaimSummaryQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    userId\n  }\n  salesforce {\n    uiapi {\n      ...AwardRateOverridesMessageFragment\n      ...StatusChangesLogsFragment\n      ...TitleFragment\n      ...TotalCostsClaimedFragment\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        ClaimForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {Acc_ClaimStatus__c: {ne: \"New \"}}, {Acc_ClaimStatus__c: {ne: \"Not used\"}}]}, first: 2000) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Id\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_IARRequired__c {\n                value\n              }\n              Acc_PCF_Status__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ReasonForDifference__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}, Acc_ProjectPeriodNumber__c: {order: ASC}}) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimsByPeriodForDocuments: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              RecordType {\n                Name {\n                  value\n                }\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_Award_Rate__c {\n                value\n              }\n              Acc_TotalParticipantGrant__c {\n                value\n              }\n              Acc_TotalFutureForecastsForParticipant__c {\n                value\n              }\n              Acc_TotalApprovedCosts__c {\n                value\n              }\n              Acc_TotalParticipantCosts__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Impact_Management_Participation__c {\n                value\n              }\n              Acc_NonFEC__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_MonitoringLevel__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment AwardRateOverridesMessageFragment on UIAPI {\n  query {\n    AwardRateOverridesMessage_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n    AwardRateOverridesMessage_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TotalCostsClaimedFragment on UIAPI {\n  query {\n    TotalCostsClaimed_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}, Acc_ProjectPeriodNumber__c: {order: ASC}}) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_ClaimOverrides: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_Award_Rate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2f8fb367a410b1fb41ff986c53d9c43f";

export default node;
