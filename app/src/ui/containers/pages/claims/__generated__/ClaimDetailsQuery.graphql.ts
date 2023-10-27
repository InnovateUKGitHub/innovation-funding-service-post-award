/**
 * @generated SignedSource<<ffebb7e61807c5c26e208f3db932871a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ClaimDetailsQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null | undefined;
};
export type ClaimDetailsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Claims__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_ApprovedDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ClaimStatus__c:
                                | {
                                    readonly label: string | null | undefined;
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_CostCategory__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_FinalClaim__c:
                                | {
                                    readonly value: boolean | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_PeriodCostCategoryTotal__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectParticipant__r:
                                | {
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
                                    readonly Id: string;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodCost__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodEndDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodNumber__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodStartDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalCostsApproved__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalCostsSubmitted__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalDeferredAmount__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Id: string;
                              readonly LastModifiedDate:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly RecordType:
                                | {
                                    readonly DeveloperName:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
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
        readonly Acc_CostCategory__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_CompetitionType__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_CostCategoryName__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_DisplayOrder__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_OrganisationType__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
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
        readonly Acc_Profile__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_CostCategoryGOLCost__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_CostCategory__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_LatestForecastCost__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodEndDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodNumber__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodStartDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Id: string;
                              readonly RecordType:
                                | {
                                    readonly DeveloperName:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
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
                              readonly Acc_ForecastLastModifiedDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_OrganisationType__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_Overdue_Project__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_OverheadRate__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ParticipantStatus__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectRole__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalCostsSubmitted__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalFutureForecastsForParticipant__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalParticipantCosts__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_TotalParticipantGrant__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
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
                              readonly Acc_CompetitionType__c:
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
        readonly ClaimDetails:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_ClaimStatus__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_CostCategory__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_PeriodCostCategoryTotal__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodEndDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodNumber__c:
                                | {
                                    readonly value: number | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly Acc_ProjectPeriodStartDate__c:
                                | {
                                    readonly value: string | null | undefined;
                                  }
                                | null
                                | undefined;
                              readonly RecordType:
                                | {
                                    readonly DeveloperName:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
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
        readonly ClaimsByPeriodForDocuments:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_CostCategory__c:
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
                              readonly RecordType:
                                | {
                                    readonly DeveloperName:
                                      | {
                                          readonly value: string | null | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
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
      readonly " $fragmentSpreads": FragmentRefs<
        "ForecastTableFragment" | "StatusChangesLogsFragment" | "TitleFragment"
      >;
    };
  };
};
export type ClaimDetailsQuery = {
  response: ClaimDetailsQuery$data;
  variables: ClaimDetailsQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "partnerId",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "periodId",
    },
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "projectId",
    },
    v3 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "projectIdStr",
    },
    v4 = {
      kind: "Literal",
      name: "first",
      value: 2000,
    },
    v5 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "partnerId",
      },
    ],
    v6 = [
      {
        fields: v5 /*: any*/,
        kind: "ObjectValue",
        name: "Acc_ProjectParticipant__c",
      },
    ],
    v7 = {
      fields: v6 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v8 = {
      RecordType: {
        DeveloperName: {
          eq: "Profile_Detail",
        },
      },
    },
    v9 = {
      RecordType: {
        DeveloperName: {
          eq: "Total_Cost_Category",
        },
      },
    },
    v10 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v11 = {
      kind: "Literal",
      name: "and.2",
      value: v10 /*: any*/,
    },
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "value",
      storageKey: null,
    },
    v14 = [v13 /*: any*/],
    v15 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v16 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryGOLCost__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v17 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v18 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v20 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_LatestForecastCost__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v21 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "StringValue",
          kind: "LinkedField",
          name: "DeveloperName",
          plural: false,
          selections: v14 /*: any*/,
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v22 = {
      alias: null,
      args: [
        v4 /*: any*/,
        {
          fields: [
            {
              items: [
                v7 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.1",
                  value: {
                    or: [v8 /*: any*/, v9 /*: any*/],
                  },
                },
                v11 /*: any*/,
              ],
              kind: "ListValue",
              name: "and",
            },
          ],
          kind: "ObjectValue",
          name: "where",
        },
      ],
      concreteType: "Acc_Profile__cConnection",
      kind: "LinkedField",
      name: "Acc_Profile__c",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Acc_Profile__cEdge",
          kind: "LinkedField",
          name: "edges",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "Acc_Profile__c",
              kind: "LinkedField",
              name: "node",
              plural: false,
              selections: [
                v12 /*: any*/,
                v15 /*: any*/,
                v16 /*: any*/,
                v17 /*: any*/,
                v18 /*: any*/,
                v19 /*: any*/,
                v20 /*: any*/,
                v21 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v23 = {
      kind: "Literal",
      name: "orderBy",
      value: {
        Acc_ProjectParticipant__r: {
          Acc_AccountId__r: {
            Name: {
              order: "ASC",
            },
          },
        },
      },
    },
    v24 = {
      fields: [
        {
          fields: [
            {
              kind: "Variable",
              name: "eq",
              variableName: "projectIdStr",
            },
          ],
          kind: "ObjectValue",
          name: "Acc_ProjectID__c",
        },
      ],
      kind: "ObjectValue",
      name: "and.0",
    },
    v25 = {
      fields: v6 /*: any*/,
      kind: "ObjectValue",
      name: "and.1",
    },
    v26 = [
      {
        fields: [
          {
            kind: "Variable",
            name: "eq",
            variableName: "periodId",
          },
        ],
        kind: "ObjectValue",
        name: "Acc_ProjectPeriodNumber__c",
      },
    ],
    v27 = {
      CreatedDate: {
        order: "DESC",
      },
    },
    v28 = {
      alias: null,
      args: null,
      concreteType: "DateTimeValue",
      kind: "LinkedField",
      name: "CreatedDate",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Name",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v30 = {
      alias: "ClaimsByPeriodForDocuments",
      args: [
        v4 /*: any*/,
        v23 /*: any*/,
        {
          fields: [
            {
              items: [
                v24 /*: any*/,
                v25 /*: any*/,
                {
                  fields: v26 /*: any*/,
                  kind: "ObjectValue",
                  name: "and.2",
                },
              ],
              kind: "ListValue",
              name: "and",
            },
          ],
          kind: "ObjectValue",
          name: "where",
        },
      ],
      concreteType: "Acc_Claims__cConnection",
      kind: "LinkedField",
      name: "Acc_Claims__c",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Acc_Claims__cEdge",
          kind: "LinkedField",
          name: "edges",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "Acc_Claims__c",
              kind: "LinkedField",
              name: "node",
              plural: false,
              selections: [
                v21 /*: any*/,
                v15 /*: any*/,
                {
                  alias: null,
                  args: [
                    v4 /*: any*/,
                    {
                      kind: "Literal",
                      name: "orderBy",
                      value: {
                        ContentDocument: v27 /*: any*/,
                      },
                    },
                  ],
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
                            v12 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "IDValue",
                              kind: "LinkedField",
                              name: "LinkedEntityId",
                              plural: false,
                              selections: v14 /*: any*/,
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "isFeedAttachment",
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "isOwner",
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              concreteType: "ContentDocument",
                              kind: "LinkedField",
                              name: "ContentDocument",
                              plural: false,
                              selections: [
                                v12 /*: any*/,
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
                                      selections: v14 /*: any*/,
                                      storageKey: null,
                                    },
                                  ],
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "LongTextAreaValue",
                                  kind: "LinkedField",
                                  name: "Description",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                v28 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "IDValue",
                                  kind: "LinkedField",
                                  name: "LatestPublishedVersionId",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "FileExtension",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Title",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "IntValue",
                                  kind: "LinkedField",
                                  name: "ContentSize",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "User",
                                  kind: "LinkedField",
                                  name: "CreatedBy",
                                  plural: false,
                                  selections: [v29 /*: any*/, v12 /*: any*/],
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
                  storageKey:
                    'ContentDocumentLinks(first:2000,orderBy:{"ContentDocument":{"CreatedDate":{"order":"DESC"}}})',
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
    v31 = {
      RecordType: {
        DeveloperName: {
          eq: "Claims_Detail",
        },
      },
    },
    v32 = {
      kind: "Literal",
      name: "and.2",
      value: {
        Acc_ClaimStatus__c: {
          ne: "New",
        },
      },
    },
    v33 = {
      kind: "Literal",
      name: "and.3",
      value: v10 /*: any*/,
    },
    v34 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v35 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v36 = {
      alias: "ClaimDetails",
      args: [
        v4 /*: any*/,
        v23 /*: any*/,
        {
          fields: [
            {
              items: [
                v7 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.1",
                  value: v31 /*: any*/,
                },
                v32 /*: any*/,
                v33 /*: any*/,
              ],
              kind: "ListValue",
              name: "and",
            },
          ],
          kind: "ObjectValue",
          name: "where",
        },
      ],
      concreteType: "Acc_Claims__cConnection",
      kind: "LinkedField",
      name: "Acc_Claims__c",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Acc_Claims__cEdge",
          kind: "LinkedField",
          name: "edges",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "Acc_Claims__c",
              kind: "LinkedField",
              name: "node",
              plural: false,
              selections: [
                v21 /*: any*/,
                v34 /*: any*/,
                v15 /*: any*/,
                v35 /*: any*/,
                v19 /*: any*/,
                v17 /*: any*/,
                v18 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v37 = {
      RecordType: {
        DeveloperName: {
          eq: "Total_Project_Period",
        },
      },
    },
    v38 = {
      kind: "Literal",
      name: "and.1",
      value: v37 /*: any*/,
    },
    v39 = {
      kind: "Literal",
      name: "and.3",
      value: {
        Acc_ClaimStatus__c: {
          ne: "Not used",
        },
      },
    },
    v40 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: [v29 /*: any*/],
      storageKey: null,
    },
    v41 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_TotalCostsSubmitted__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v42 = {
      alias: null,
      args: [
        v4 /*: any*/,
        v23 /*: any*/,
        {
          fields: [
            {
              items: [v24 /*: any*/, v38 /*: any*/, v32 /*: any*/, v39 /*: any*/],
              kind: "ListValue",
              name: "and",
            },
          ],
          kind: "ObjectValue",
          name: "where",
        },
      ],
      concreteType: "Acc_Claims__cConnection",
      kind: "LinkedField",
      name: "Acc_Claims__c",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Acc_Claims__cEdge",
          kind: "LinkedField",
          name: "edges",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "Acc_Claims__c",
              kind: "LinkedField",
              name: "node",
              plural: false,
              selections: [
                v12 /*: any*/,
                v21 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "Acc_ProjectParticipant__c",
                  kind: "LinkedField",
                  name: "Acc_ProjectParticipant__r",
                  plural: false,
                  selections: [v40 /*: any*/, v12 /*: any*/],
                  storageKey: null,
                },
                v35 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "DateTimeValue",
                  kind: "LinkedField",
                  name: "LastModifiedDate",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "DateValue",
                  kind: "LinkedField",
                  name: "Acc_ApprovedDate__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ClaimStatus__c",
                  plural: false,
                  selections: [
                    v13 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "label",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
                v19 /*: any*/,
                v18 /*: any*/,
                v17 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_ProjectPeriodCost__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalCostsApproved__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v41 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalDeferredAmount__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v15 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v43 = [v4 /*: any*/],
    v44 = [
      {
        alias: null,
        args: null,
        concreteType: "Acc_CostCategory__cEdge",
        kind: "LinkedField",
        name: "edges",
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "Acc_CostCategory__c",
            kind: "LinkedField",
            name: "node",
            plural: false,
            selections: [
              v12 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "StringValue",
                kind: "LinkedField",
                name: "Acc_CostCategoryName__c",
                plural: false,
                selections: v14 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "DoubleValue",
                kind: "LinkedField",
                name: "Acc_DisplayOrder__c",
                plural: false,
                selections: v14 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "StringValue",
                kind: "LinkedField",
                name: "Acc_OrganisationType__c",
                plural: false,
                selections: v14 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "PicklistValue",
                kind: "LinkedField",
                name: "Acc_CompetitionType__c",
                plural: false,
                selections: v14 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v45 = {
      alias: null,
      args: v43 /*: any*/,
      concreteType: "Acc_CostCategory__cConnection",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v44 /*: any*/,
      storageKey: "Acc_CostCategory__c(first:2000)",
    },
    v46 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v47 = {
      fields: [
        {
          items: [
            {
              fields: [
                {
                  fields: v46 /*: any*/,
                  kind: "ObjectValue",
                  name: "Acc_ProjectId__c",
                },
              ],
              kind: "ObjectValue",
              name: "and.0",
            },
            {
              fields: [
                {
                  fields: v5 /*: any*/,
                  kind: "ObjectValue",
                  name: "Id",
                },
              ],
              kind: "ObjectValue",
              name: "and.1",
            },
          ],
          kind: "ListValue",
          name: "and",
        },
      ],
      kind: "ObjectValue",
      name: "where",
    },
    v48 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v49 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_OrganisationType__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v50 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v51 = {
      alias: null,
      args: null,
      concreteType: "PercentValue",
      kind: "LinkedField",
      name: "Acc_OverheadRate__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v52 = {
      alias: null,
      args: [v47 /*: any*/],
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
                v12 /*: any*/,
                v40 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "IDValue",
                  kind: "LinkedField",
                  name: "Acc_AccountId__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalParticipantGrant__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v48 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "DateTimeValue",
                  kind: "LinkedField",
                  name: "Acc_ForecastLastModifiedDate__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v49 /*: any*/,
                v50 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalFutureForecastsForParticipant__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalParticipantCosts__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v41 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "StringValue",
                  kind: "LinkedField",
                  name: "Acc_Overdue_Project__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v51 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v53 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      {
        fields: [
          {
            fields: v46 /*: any*/,
            kind: "ObjectValue",
            name: "Id",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v54 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v55 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v56 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v57 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CompetitionType__c",
      plural: false,
      selections: v14 /*: any*/,
      storageKey: null,
    },
    v58 = {
      alias: null,
      args: v53 /*: any*/,
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
                v12 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "isActive",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "Ext_Project_Roles",
                  kind: "LinkedField",
                  name: "roles",
                  plural: false,
                  selections: [
                    v54 /*: any*/,
                    v55 /*: any*/,
                    v56 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Ext_Partner_Roles",
                      kind: "LinkedField",
                      name: "partnerRoles",
                      plural: true,
                      selections: [
                        v54 /*: any*/,
                        v55 /*: any*/,
                        v56 /*: any*/,
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
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ProjectStatus__c",
                  plural: false,
                  selections: v14 /*: any*/,
                  storageKey: null,
                },
                v57 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v59 = [
      v4 /*: any*/,
      {
        fields: [
          {
            items: [
              v7 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v8 /*: any*/,
              },
              v11 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, v3 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ClaimDetailsQuery",
      selections: [
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
                  args: null,
                  kind: "FragmentSpread",
                  name: "StatusChangesLogsFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ForecastTableFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "TitleFragment",
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [
                    v22 /*: any*/,
                    v30 /*: any*/,
                    v36 /*: any*/,
                    v42 /*: any*/,
                    v45 /*: any*/,
                    v52 /*: any*/,
                    v58 /*: any*/,
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
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v2 /*: any*/, v3 /*: any*/, v0 /*: any*/, v1 /*: any*/],
      kind: "Operation",
      name: "ClaimDetailsQuery",
      selections: [
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
                      alias: "StatusChanges_Project",
                      args: v53 /*: any*/,
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
                                v12 /*: any*/,
                                v57 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v55 /*: any*/, v56 /*: any*/, v54 /*: any*/],
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
                    {
                      alias: "StatusChanges_StatusChanges",
                      args: [
                        v4 /*: any*/,
                        {
                          kind: "Literal",
                          name: "orderBy",
                          value: v27 /*: any*/,
                        },
                        {
                          fields: [
                            {
                              fields: [
                                {
                                  items: [
                                    v7 /*: any*/,
                                    {
                                      fields: v26 /*: any*/,
                                      kind: "ObjectValue",
                                      name: "and.1",
                                    },
                                  ],
                                  kind: "ListValue",
                                  name: "and",
                                },
                              ],
                              kind: "ObjectValue",
                              name: "Acc_Claim__r",
                            },
                          ],
                          kind: "ObjectValue",
                          name: "where",
                        },
                      ],
                      concreteType: "Acc_StatusChange__cConnection",
                      kind: "LinkedField",
                      name: "Acc_StatusChange__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_StatusChange__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_StatusChange__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [
                                v12 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "TextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_NewClaimStatus__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "LongTextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_ExternalComment__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_ParticipantVisibility__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CreatedByAlias__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                v28 /*: any*/,
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
                      alias: "ForecastTable_ProfileForCostCategory",
                      args: v59 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Profile__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Profile__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [v12 /*: any*/, v15 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_ForecastDetails",
                      args: v59 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Profile__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Profile__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [
                                v12 /*: any*/,
                                v15 /*: any*/,
                                v17 /*: any*/,
                                v18 /*: any*/,
                                v19 /*: any*/,
                                v20 /*: any*/,
                                v21 /*: any*/,
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
                      alias: "ForecastTable_GolCosts",
                      args: [
                        v4 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v7 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v9 /*: any*/,
                                },
                                v11 /*: any*/,
                              ],
                              kind: "ListValue",
                              name: "and",
                            },
                          ],
                          kind: "ObjectValue",
                          name: "where",
                        },
                      ],
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Profile__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Profile__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [v12 /*: any*/, v15 /*: any*/, v16 /*: any*/, v21 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_AllClaimsForPartner",
                      args: [
                        v4 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v7 /*: any*/,
                                v38 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    Acc_ClaimStatus__c: {
                                      ne: "New ",
                                    },
                                  },
                                },
                                v39 /*: any*/,
                              ],
                              kind: "ListValue",
                              name: "and",
                            },
                          ],
                          kind: "ObjectValue",
                          name: "where",
                        },
                      ],
                      concreteType: "Acc_Claims__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Claims__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Claims__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Claims__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [v21 /*: any*/, v12 /*: any*/, v34 /*: any*/, v17 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_ClaimDetails",
                      args: [
                        v4 /*: any*/,
                        v23 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v7 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: {
                                    RecordType: {
                                      Name: {
                                        eq: "Claims Detail",
                                      },
                                    },
                                  },
                                },
                                v32 /*: any*/,
                                v33 /*: any*/,
                              ],
                              kind: "ListValue",
                              name: "and",
                            },
                          ],
                          kind: "ObjectValue",
                          name: "where",
                        },
                      ],
                      concreteType: "Acc_Claims__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Claims__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Claims__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Claims__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [
                                v21 /*: any*/,
                                v15 /*: any*/,
                                v34 /*: any*/,
                                v35 /*: any*/,
                                v19 /*: any*/,
                                v17 /*: any*/,
                                v18 /*: any*/,
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
                      alias: "ForecastTable_ClaimsForIarDue",
                      args: [
                        v4 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v24 /*: any*/,
                                v25 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    or: [v37 /*: any*/, v31 /*: any*/],
                                  },
                                },
                              ],
                              kind: "ListValue",
                              name: "and",
                            },
                          ],
                          kind: "ObjectValue",
                          name: "where",
                        },
                      ],
                      concreteType: "Acc_Claims__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Claims__c",
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: "Acc_Claims__cEdge",
                          kind: "LinkedField",
                          name: "edges",
                          plural: true,
                          selections: [
                            {
                              alias: null,
                              args: null,
                              concreteType: "Acc_Claims__c",
                              kind: "LinkedField",
                              name: "node",
                              plural: false,
                              selections: [
                                v21 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                v17 /*: any*/,
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
                      alias: "ForecastTable_CostCategory",
                      args: v43 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v44 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ForecastTable_Partner",
                      args: [v4 /*: any*/, v47 /*: any*/],
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
                                v12 /*: any*/,
                                v40 /*: any*/,
                                v48 /*: any*/,
                                v49 /*: any*/,
                                v50 /*: any*/,
                                v51 /*: any*/,
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
                      alias: "ForecastTable_Project",
                      args: v53 /*: any*/,
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
                                v12 /*: any*/,
                                v57 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_CurrentPeriodNumber__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
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
                    {
                      alias: "Title_Project",
                      args: v53 /*: any*/,
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
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectNumber__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v14 /*: any*/,
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
                    v22 /*: any*/,
                    v30 /*: any*/,
                    v36 /*: any*/,
                    v42 /*: any*/,
                    v45 /*: any*/,
                    v52 /*: any*/,
                    v58 /*: any*/,
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
    },
    params: {
      cacheID: "e56edba4bc59ec058f71c9116789a7b2",
      id: null,
      metadata: {},
      name: "ClaimDetailsQuery",
      operationKind: "query",
      text: 'query ClaimDetailsQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  salesforce {\n    uiapi {\n      ...StatusChangesLogsFragment\n      ...ForecastTableFragment\n      ...TitleFragment\n      query {\n        Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {RecordType: {DeveloperName: {eq: "Total_Cost_Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategoryGOLCost__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_LatestForecastCost__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        ClaimsByPeriodForDocuments: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    isOwner\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Claims_Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_ProjectParticipant__r {\n                Acc_AccountId__r {\n                  Name {\n                    value\n                  }\n                }\n                Id\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              LastModifiedDate {\n                value\n              }\n              Acc_ApprovedDate__c {\n                value\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n              Acc_TotalCostsApproved__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_TotalDeferredAmount__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountId__c {\n                value\n              }\n              Acc_TotalParticipantGrant__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_ForecastLastModifiedDate__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n              Acc_TotalFutureForecastsForParticipant__c {\n                value\n              }\n              Acc_TotalParticipantCosts__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_Overdue_Project__c {\n                value\n              }\n              Acc_OverheadRate__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Cost_Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}, {RecordType: {DeveloperName: {eq: "Claims_Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "880ca78e08797014ddc81937b643d68e";

export default node;
