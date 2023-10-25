/**
 * @generated SignedSource<<871784cf7fbbdb57bc8e2cd4db0b8d69>>
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
              readonly IM_PhasedCompetitionStage__c: {
                readonly value: string | null;
              } | null;
              readonly IM_PhasedCompetition__c: {
                readonly value: boolean | null;
              } | null;
              readonly Id: string;
              readonly Impact_Management_Participation__c: {
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
v23 = {
  "order": "ASC"
},
v24 = {
  "Acc_AccountId__r": {
    "Name": (v23/*: any*/)
  }
},
v25 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "Acc_ProjectParticipant__r": (v24/*: any*/),
    "Acc_ProjectPeriodNumber__c": (v23/*: any*/)
  }
},
v26 = [
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
v27 = {
  "fields": (v26/*: any*/),
  "kind": "ObjectValue",
  "name": "and.1"
},
v28 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Project_Period"
    }
  }
},
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ClaimStatus__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Impact_Management_Participation__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v31 = {
  "alias": "ClaimForPartner",
  "args": [
    (v5/*: any*/),
    (v25/*: any*/),
    {
      "fields": [
        {
          "items": [
            (v8/*: any*/),
            (v27/*: any*/),
            {
              "kind": "Literal",
              "name": "and.2",
              "value": (v28/*: any*/)
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
            (v29/*: any*/),
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
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "IM_PhasedCompetition__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "IM_PhasedCompetitionStage__c",
              "plural": false,
              "selections": (v13/*: any*/),
              "storageKey": null
            },
            (v30/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v32 = [
  (v5/*: any*/),
  (v25/*: any*/),
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
v33 = {
  "alias": null,
  "args": null,
  "concreteType": "CurrencyValue",
  "kind": "LinkedField",
  "name": "Acc_PeriodCostCategoryTotal__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v34 = {
  "alias": "ClaimDetails",
  "args": (v32/*: any*/),
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
            (v29/*: any*/),
            (v14/*: any*/),
            (v33/*: any*/),
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
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v36 = {
  "CreatedDate": {
    "order": "DESC"
  }
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "DateTimeValue",
  "kind": "LinkedField",
  "name": "CreatedDate",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v38 = {
  "alias": "ClaimsByPeriodForDocuments",
  "args": [
    (v5/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_ProjectParticipant__r": (v24/*: any*/)
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
              "fields": (v26/*: any*/),
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
                (v35/*: any*/),
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
                    "ContentDocument": (v36/*: any*/)
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
                            (v37/*: any*/),
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
                                (v35/*: any*/),
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
v39 = [
  (v5/*: any*/)
],
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_DisplayOrder__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_OrganisationType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": (v39/*: any*/),
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
            (v40/*: any*/),
            (v41/*: any*/),
            (v42/*: any*/),
            (v43/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "Acc_CostCategory__c(first:2000)"
},
v45 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v46 = [
  (v5/*: any*/),
  {
    "fields": [
      {
        "items": [
          {
            "fields": [
              {
                "fields": (v45/*: any*/),
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
v47 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_Award_Rate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": (v46/*: any*/),
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
            (v47/*: any*/),
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
v49 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  {
    "fields": [
      {
        "fields": (v45/*: any*/),
        "kind": "ObjectValue",
        "name": "Id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "concreteType": "BooleanValue",
  "kind": "LinkedField",
  "name": "Acc_NonFEC__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": (v49/*: any*/),
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
                (v50/*: any*/),
                (v51/*: any*/),
                (v52/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Ext_Partner_Roles",
                  "kind": "LinkedField",
                  "name": "partnerRoles",
                  "plural": true,
                  "selections": [
                    (v50/*: any*/),
                    (v51/*: any*/),
                    (v52/*: any*/),
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
            (v30/*: any*/),
            (v53/*: any*/),
            (v54/*: any*/),
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
v56 = {
  "alias": null,
  "args": null,
  "concreteType": "Acc_CostCategory__c",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__r",
  "plural": false,
  "selections": [
    (v40/*: any*/)
  ],
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_OverrideAwardRate__c",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v58 = {
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
                  (v31/*: any*/),
                  (v34/*: any*/),
                  (v38/*: any*/),
                  (v44/*: any*/),
                  (v48/*: any*/),
                  (v55/*: any*/)
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
                    "args": (v49/*: any*/),
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
                              (v53/*: any*/)
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
                                    (v28/*: any*/),
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
                              (v56/*: any*/),
                              (v15/*: any*/),
                              (v57/*: any*/),
                              (v16/*: any*/),
                              (v58/*: any*/),
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
                    "args": (v49/*: any*/),
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
                              (v54/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Project_Roles",
                                "kind": "LinkedField",
                                "name": "roles",
                                "plural": false,
                                "selections": [
                                  (v51/*: any*/),
                                  (v52/*: any*/),
                                  (v50/*: any*/)
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
                        "value": (v36/*: any*/)
                      },
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "items": [
                                  (v8/*: any*/),
                                  (v27/*: any*/)
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
                              (v37/*: any*/)
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
                    "args": (v49/*: any*/),
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
                    "args": (v32/*: any*/),
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
                              (v33/*: any*/),
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
                              (v56/*: any*/),
                              (v15/*: any*/),
                              (v57/*: any*/),
                              (v16/*: any*/),
                              (v58/*: any*/)
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
                    "args": (v39/*: any*/),
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
                              (v40/*: any*/),
                              (v41/*: any*/),
                              (v42/*: any*/),
                              (v43/*: any*/),
                              (v57/*: any*/)
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
                    "args": (v46/*: any*/),
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
                              (v47/*: any*/)
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
                    "args": (v49/*: any*/),
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
                              (v53/*: any*/)
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
                  (v31/*: any*/),
                  (v34/*: any*/),
                  (v38/*: any*/),
                  (v44/*: any*/),
                  (v48/*: any*/),
                  (v55/*: any*/)
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
    "cacheID": "bd2c8335bdcfee818cdefffc627a96cd",
    "id": null,
    "metadata": {},
    "name": "ClaimSummaryQuery",
    "operationKind": "query",
    "text": "query ClaimSummaryQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    userId\n  }\n  salesforce {\n    uiapi {\n      ...AwardRateOverridesMessageFragment\n      ...StatusChangesLogsFragment\n      ...TitleFragment\n      ...TotalCostsClaimedFragment\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Profile_Detail\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        ClaimForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {Acc_ClaimStatus__c: {ne: \"New \"}}, {Acc_ClaimStatus__c: {ne: \"Not used\"}}]}, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}, Acc_ProjectPeriodNumber__c: {order: ASC}}, first: 2000) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Id\n              Acc_ProjectParticipant__c {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_IARRequired__c {\n                value\n              }\n              Acc_PCF_Status__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ReasonForDifference__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n              IM_PhasedCompetition__c {\n                value\n              }\n              IM_PhasedCompetitionStage__c {\n                value\n              }\n              Impact_Management_Participation__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}, Acc_ProjectPeriodNumber__c: {order: ASC}}) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimsByPeriodForDocuments: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              RecordType {\n                Name {\n                  value\n                }\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_Award_Rate__c {\n                value\n              }\n              Acc_TotalParticipantGrant__c {\n                value\n              }\n              Acc_TotalFutureForecastsForParticipant__c {\n                value\n              }\n              Acc_TotalApprovedCosts__c {\n                value\n              }\n              Acc_TotalParticipantCosts__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Impact_Management_Participation__c {\n                value\n              }\n              Acc_NonFEC__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_MonitoringLevel__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment AwardRateOverridesMessageFragment on UIAPI {\n  query {\n    AwardRateOverridesMessage_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n    AwardRateOverridesMessage_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: \"Total_Project_Period\"}}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TotalCostsClaimedFragment on UIAPI {\n  query {\n    TotalCostsClaimed_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Claims_Detail\"}}}, {Acc_ClaimStatus__c: {ne: \"New\"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}, Acc_ProjectPeriodNumber__c: {order: ASC}}) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_ClaimOverrides: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: \"Total_Cost_Category\"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_Award_Rate__c {\n            value\n          }\n        }\n      }\n    }\n    TotalCostsClaimed_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e0d0e949468c219bacc1971d4714ad66";

export default node;
