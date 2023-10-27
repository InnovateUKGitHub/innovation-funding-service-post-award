/**
 * @generated SignedSource<<e5de53cfe55a25382956e68a576ea3e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewForecastQuery$variables = {
  partnerId: string;
  projectId: string;
  projectIdStr: string;
};
export type ViewForecastQuery$data = {
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
                              readonly Acc_ClaimStatus__c: {
                                readonly value: string | null;
                              } | null;
                              readonly Acc_FinalClaim__c: {
                                readonly value: boolean | null;
                              } | null;
                              readonly Acc_PaidDate__c: {
                                readonly value: string | null;
                              } | null;
                              readonly Acc_ProjectPeriodNumber__c: {
                                readonly value: number | null;
                              } | null;
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
        readonly Acc_Project__c:
          | {
              readonly edges:
                | ReadonlyArray<
                    | {
                        readonly node:
                          | {
                              readonly Acc_CurrentPeriodNumber__c: {
                                readonly value: number | null;
                              } | null;
                              readonly Acc_ProjectParticipantsProject__r:
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
                                                    readonly Acc_NewForecastNeeded__c: {
                                                      readonly value: boolean | null;
                                                    } | null;
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
                              readonly Acc_ProjectStatus__c: {
                                readonly value: string | null;
                              } | null;
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
      };
      readonly " $fragmentSpreads": FragmentRefs<"ForecastTableFragment" | "ForecastWarningFragment" | "TitleFragment">;
    };
  };
};
export type ViewForecastQuery = {
  response: ViewForecastQuery$data;
  variables: ViewForecastQuery$variables;
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
      name: "projectId",
    },
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "projectIdStr",
    },
    v3 = {
      kind: "Literal",
      name: "first",
      value: 2000,
    },
    v4 = {
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
      name: "and.1",
    },
    v8 = {
      RecordType: {
        DeveloperName: {
          eq: "Total_Project_Period",
        },
      },
    },
    v9 = [
      v3 /*: any*/,
      {
        fields: [
          {
            items: [
              v4 /*: any*/,
              v7 /*: any*/,
              {
                kind: "Literal",
                name: "and.2",
                value: v8 /*: any*/,
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
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v11 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "value",
        storageKey: null,
      },
    ],
    v12 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v13 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v14 = {
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
          selections: v11 /*: any*/,
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v15 = {
      alias: null,
      args: v9 /*: any*/,
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
                v10 /*: any*/,
                v12 /*: any*/,
                v13 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v11 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "DateValue",
                  kind: "LinkedField",
                  name: "Acc_PaidDate__c",
                  plural: false,
                  selections: v11 /*: any*/,
                  storageKey: null,
                },
                v14 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v16 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v17 = {
      fields: [
        {
          fields: v16 /*: any*/,
          kind: "ObjectValue",
          name: "Id",
        },
      ],
      kind: "ObjectValue",
      name: "where",
    },
    v18 = [v17 /*: any*/],
    v19 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v20 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v21 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v22 = {
      alias: null,
      args: null,
      concreteType: "Ext_Project_Roles",
      kind: "LinkedField",
      name: "roles",
      plural: false,
      selections: [
        v19 /*: any*/,
        v20 /*: any*/,
        v21 /*: any*/,
        {
          alias: null,
          args: null,
          concreteType: "Ext_Partner_Roles",
          kind: "LinkedField",
          name: "partnerRoles",
          plural: true,
          selections: [
            v20 /*: any*/,
            v19 /*: any*/,
            v21 /*: any*/,
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
    v23 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_CurrentPeriodNumber__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v24 = [
      {
        fields: v5 /*: any*/,
        kind: "ObjectValue",
        name: "Id",
      },
    ],
    v25 = [
      {
        kind: "Literal",
        name: "first",
        value: 500,
      },
      {
        fields: v24 /*: any*/,
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v26 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "StringValue",
          kind: "LinkedField",
          name: "Name",
          plural: false,
          selections: v11 /*: any*/,
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v27 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v28 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      concreteType: "PercentValue",
      kind: "LinkedField",
      name: "Acc_OverheadRate__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v30 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_AccountId__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v31 = {
      alias: null,
      args: v18 /*: any*/,
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
                v10 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "isActive",
                  storageKey: null,
                },
                v22 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ProjectStatus__c",
                  plural: false,
                  selections: v11 /*: any*/,
                  storageKey: null,
                },
                v23 /*: any*/,
                {
                  alias: null,
                  args: v25 /*: any*/,
                  concreteType: "Acc_ProjectParticipant__cConnection",
                  kind: "LinkedField",
                  name: "Acc_ProjectParticipantsProject__r",
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
                            v10 /*: any*/,
                            v26 /*: any*/,
                            v27 /*: any*/,
                            v28 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "BooleanValue",
                              kind: "LinkedField",
                              name: "Acc_NewForecastNeeded__c",
                              plural: false,
                              selections: v11 /*: any*/,
                              storageKey: null,
                            },
                            v29 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "DateTimeValue",
                              kind: "LinkedField",
                              name: "Acc_ForecastLastModifiedDate__c",
                              plural: false,
                              selections: v11 /*: any*/,
                              storageKey: null,
                            },
                            v30 /*: any*/,
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
    v32 = {
      fields: v6 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v33 = {
      RecordType: {
        DeveloperName: {
          eq: "Profile_Detail",
        },
      },
    },
    v34 = {
      RecordType: {
        DeveloperName: {
          eq: "Total_Cost_Category",
        },
      },
    },
    v35 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v36 = {
      kind: "Literal",
      name: "and.2",
      value: v35 /*: any*/,
    },
    v37 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v38 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryGOLCost__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v39 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_LatestForecastCost__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v40 = [v3 /*: any*/],
    v41 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryName__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v42 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_DisplayOrder__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v43 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v44 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      v17 /*: any*/,
    ],
    v45 = [
      v3 /*: any*/,
      {
        fields: [
          {
            items: [
              v32 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v33 /*: any*/,
              },
              v36 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v46 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    },
    v47 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v11 /*: any*/,
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ViewForecastQuery",
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
                  name: "ForecastWarningFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "TitleFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ForecastTableFragment",
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [v15 /*: any*/, v31 /*: any*/],
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
      argumentDefinitions: [v2 /*: any*/, v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ViewForecastQuery",
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
                      alias: "ForecastWarning_Profile",
                      args: [
                        {
                          kind: "Literal",
                          name: "first",
                          value: 1000,
                        },
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: {
                                    or: [v33 /*: any*/, v34 /*: any*/],
                                  },
                                },
                                v36 /*: any*/,
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
                                v10 /*: any*/,
                                v37 /*: any*/,
                                v38 /*: any*/,
                                v13 /*: any*/,
                                v39 /*: any*/,
                                v14 /*: any*/,
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
                      alias: "ForecastWarning_CostCategory",
                      args: v40 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: [
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
                              selections: [v10 /*: any*/, v41 /*: any*/, v42 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ForecastWarning_Claims",
                      args: v9 /*: any*/,
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
                                v10 /*: any*/,
                                v13 /*: any*/,
                                v37 /*: any*/,
                                v12 /*: any*/,
                                v14 /*: any*/,
                                v43 /*: any*/,
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
                      alias: "ForecastWarning_Project",
                      args: v18 /*: any*/,
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
                                v10 /*: any*/,
                                v22 /*: any*/,
                                {
                                  alias: null,
                                  args: v25 /*: any*/,
                                  concreteType: "Acc_ProjectParticipant__cConnection",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectParticipantsProject__r",
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
                                          selections: [v10 /*: any*/, v30 /*: any*/],
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
                    {
                      alias: "Title_Project",
                      args: v44 /*: any*/,
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
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
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
                      alias: "ForecastTable_ProfileForCostCategory",
                      args: v45 /*: any*/,
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
                              selections: [v10 /*: any*/, v37 /*: any*/],
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
                      args: v45 /*: any*/,
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
                                v10 /*: any*/,
                                v37 /*: any*/,
                                v13 /*: any*/,
                                v46 /*: any*/,
                                v47 /*: any*/,
                                v39 /*: any*/,
                                v14 /*: any*/,
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
                        v3 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v34 /*: any*/,
                                },
                                v36 /*: any*/,
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
                              selections: [v10 /*: any*/, v37 /*: any*/, v38 /*: any*/, v14 /*: any*/],
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
                        v3 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v8 /*: any*/,
                                },
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    Acc_ClaimStatus__c: {
                                      ne: "New ",
                                    },
                                  },
                                },
                                {
                                  kind: "Literal",
                                  name: "and.3",
                                  value: {
                                    Acc_ClaimStatus__c: {
                                      ne: "Not used",
                                    },
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
                              selections: [v14 /*: any*/, v10 /*: any*/, v12 /*: any*/, v13 /*: any*/],
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
                        v3 /*: any*/,
                        {
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
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
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
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    Acc_ClaimStatus__c: {
                                      ne: "New",
                                    },
                                  },
                                },
                                {
                                  kind: "Literal",
                                  name: "and.3",
                                  value: v35 /*: any*/,
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
                                v14 /*: any*/,
                                v37 /*: any*/,
                                v12 /*: any*/,
                                v43 /*: any*/,
                                v47 /*: any*/,
                                v13 /*: any*/,
                                v46 /*: any*/,
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
                        v3 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v4 /*: any*/,
                                v7 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    or: [
                                      v8 /*: any*/,
                                      {
                                        RecordType: {
                                          DeveloperName: {
                                            eq: "Claims_Detail",
                                          },
                                        },
                                      },
                                    ],
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
                                v14 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                v13 /*: any*/,
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
                      args: v40 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: [
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
                                v10 /*: any*/,
                                v41 /*: any*/,
                                v42 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                              ],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ForecastTable_Partner",
                      args: [
                        v3 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                {
                                  fields: [
                                    {
                                      fields: v16 /*: any*/,
                                      kind: "ObjectValue",
                                      name: "Acc_ProjectId__c",
                                    },
                                  ],
                                  kind: "ObjectValue",
                                  name: "and.0",
                                },
                                {
                                  fields: v24 /*: any*/,
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
                                v10 /*: any*/,
                                v26 /*: any*/,
                                v28 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                v27 /*: any*/,
                                v29 /*: any*/,
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
                      args: v44 /*: any*/,
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
                                v10 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v11 /*: any*/,
                                  storageKey: null,
                                },
                                v23 /*: any*/,
                              ],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    v15 /*: any*/,
                    v31 /*: any*/,
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
      cacheID: "e56d1faf5e6a416b9348f9c0dfefe476",
      id: null,
      metadata: {},
      name: "ViewForecastQuery",
      operationKind: "query",
      text: 'query ViewForecastQuery(\n  $projectIdStr: String!\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...ForecastWarningFragment\n      ...TitleFragment\n      ...ForecastTableFragment\n      query {\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              RecordType {\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_OverheadRate__c {\n                      value\n                    }\n                    Acc_ForecastLastModifiedDate__c {\n                      value\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Cost_Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}, {RecordType: {DeveloperName: {eq: "Claims_Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastWarningFragment on UIAPI {\n  query {\n    ForecastWarning_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {DeveloperName: {eq: "Profile_Detail"}}}, {RecordType: {DeveloperName: {eq: "Total_Cost_Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 1000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastWarning_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastWarning_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {DeveloperName: {eq: "Total_Project_Period"}}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          RecordType {\n            DeveloperName {\n              value\n            }\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastWarning_Project: Acc_Project__c(where: {Id: {eq: $projectId}}) {\n      edges {\n        node {\n          Id\n          roles {\n            isMo\n            isFc\n            isPm\n            partnerRoles {\n              isFc\n              isMo\n              isPm\n              partnerId\n            }\n          }\n          Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n            edges {\n              node {\n                Id\n                Acc_AccountId__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "8776f332ec5c2ec9aad498f063f80427";

export default node;
