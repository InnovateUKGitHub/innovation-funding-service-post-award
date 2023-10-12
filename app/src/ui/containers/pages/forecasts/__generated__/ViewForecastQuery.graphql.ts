/**
 * @generated SignedSource<<582001940b0d6e0cb15329168a0a3da9>>
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
        readonly Acc_Claims__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
              } | null;
              readonly Acc_PaidDate__c: {
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
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectParticipantsProject__r: {
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
                    readonly Acc_NewForecastNeeded__c: {
                      readonly value: boolean | null;
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
                    readonly Id: string;
                  } | null;
                } | null> | null;
              } | null;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
              readonly isActive: boolean;
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly isSalesforceSystemUser: boolean;
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
      };
      readonly " $fragmentSpreads": FragmentRefs<"ForecastTableFragment" | "TitleFragment" | "WarningFragment">;
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
    v8 = [
      v3 /*: any*/,
      {
        fields: [
          {
            items: [v4 /*: any*/, v7 /*: any*/],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v10 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "value",
        storageKey: null,
      },
    ],
    v11 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v12 = [
      {
        alias: null,
        args: null,
        concreteType: "StringValue",
        kind: "LinkedField",
        name: "Name",
        plural: false,
        selections: v10 /*: any*/,
        storageKey: null,
      },
    ],
    v13 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v14 = {
      alias: null,
      args: v8 /*: any*/,
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
                v9 /*: any*/,
                v11 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v10 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "DateValue",
                  kind: "LinkedField",
                  name: "Acc_PaidDate__c",
                  plural: false,
                  selections: v10 /*: any*/,
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
    v15 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v16 = {
      fields: [
        {
          fields: v15 /*: any*/,
          kind: "ObjectValue",
          name: "Id",
        },
      ],
      kind: "ObjectValue",
      name: "where",
    },
    v17 = [v16 /*: any*/],
    v18 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v20 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v21 = {
      alias: null,
      args: null,
      concreteType: "Ext_Partner_Roles",
      kind: "LinkedField",
      name: "partnerRoles",
      plural: true,
      selections: [
        v19 /*: any*/,
        v18 /*: any*/,
        v20 /*: any*/,
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
    v22 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_CurrentPeriodNumber__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v23 = [
      {
        fields: v5 /*: any*/,
        kind: "ObjectValue",
        name: "Id",
      },
    ],
    v24 = [
      {
        kind: "Literal",
        name: "first",
        value: 500,
      },
      {
        fields: v23 /*: any*/,
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v25 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v26 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v27 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v28 = {
      alias: null,
      args: null,
      concreteType: "PercentValue",
      kind: "LinkedField",
      name: "Acc_OverheadRate__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_AccountId__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v30 = {
      alias: null,
      args: v17 /*: any*/,
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
                v9 /*: any*/,
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
                    v18 /*: any*/,
                    v19 /*: any*/,
                    v20 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "isSalesforceSystemUser",
                      storageKey: null,
                    },
                    v21 /*: any*/,
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
                  selections: v10 /*: any*/,
                  storageKey: null,
                },
                v22 /*: any*/,
                {
                  alias: null,
                  args: v24 /*: any*/,
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
                            v9 /*: any*/,
                            v25 /*: any*/,
                            v26 /*: any*/,
                            v27 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "BooleanValue",
                              kind: "LinkedField",
                              name: "Acc_NewForecastNeeded__c",
                              plural: false,
                              selections: v10 /*: any*/,
                              storageKey: null,
                            },
                            v28 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "DateTimeValue",
                              kind: "LinkedField",
                              name: "Acc_ForecastLastModifiedDate__c",
                              plural: false,
                              selections: v10 /*: any*/,
                              storageKey: null,
                            },
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
      fields: v6 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v32 = {
      RecordType: {
        Name: {
          eq: "Profile Detail",
        },
      },
    },
    v33 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v34 = {
      kind: "Literal",
      name: "and.2",
      value: v33 /*: any*/,
    },
    v35 = [
      v3 /*: any*/,
      {
        fields: [
          {
            items: [
              v31 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v32 /*: any*/,
              },
              v34 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v36 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v37 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v38 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v39 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v40 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_LatestForecastCost__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v41 = {
      RecordType: {
        Name: {
          eq: "Total Cost Category",
        },
      },
    },
    v42 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryGOLCost__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v43 = {
      RecordType: {
        Name: {
          eq: "Total Project Period",
        },
      },
    },
    v44 = {
      RecordType: {
        Name: {
          eq: "Claims Detail",
        },
      },
    },
    v45 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v46 = [v3 /*: any*/],
    v47 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryName__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v48 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_DisplayOrder__c",
      plural: false,
      selections: v10 /*: any*/,
      storageKey: null,
    },
    v49 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      v16 /*: any*/,
    ];
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
                  name: "ForecastTableFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "TitleFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "WarningFragment",
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [v14 /*: any*/, v30 /*: any*/],
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
                      alias: "ForecastTable_ProfileForCostCategory",
                      args: v35 /*: any*/,
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
                              selections: [v9 /*: any*/, v36 /*: any*/],
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
                      args: v35 /*: any*/,
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
                                v9 /*: any*/,
                                v36 /*: any*/,
                                v37 /*: any*/,
                                v38 /*: any*/,
                                v39 /*: any*/,
                                v40 /*: any*/,
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
                      alias: "ForecastTable_GolCosts",
                      args: [
                        v3 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v31 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v41 /*: any*/,
                                },
                                v34 /*: any*/,
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
                              selections: [v9 /*: any*/, v36 /*: any*/, v42 /*: any*/, v13 /*: any*/],
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
                                v31 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v43 /*: any*/,
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
                              selections: [v13 /*: any*/, v9 /*: any*/, v11 /*: any*/, v37 /*: any*/],
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
                                v31 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v44 /*: any*/,
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
                                  value: v33 /*: any*/,
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
                                v13 /*: any*/,
                                v36 /*: any*/,
                                v11 /*: any*/,
                                v45 /*: any*/,
                                v39 /*: any*/,
                                v37 /*: any*/,
                                v38 /*: any*/,
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
                                    or: [v43 /*: any*/, v44 /*: any*/],
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
                                v13 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                v37 /*: any*/,
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
                      args: v46 /*: any*/,
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
                                v9 /*: any*/,
                                v47 /*: any*/,
                                v48 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
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
                                      fields: v15 /*: any*/,
                                      kind: "ObjectValue",
                                      name: "Acc_ProjectId__c",
                                    },
                                  ],
                                  kind: "ObjectValue",
                                  name: "and.0",
                                },
                                {
                                  fields: v23 /*: any*/,
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
                                v9 /*: any*/,
                                v25 /*: any*/,
                                v27 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                v26 /*: any*/,
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
                      alias: "ForecastTable_Project",
                      args: v49 /*: any*/,
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
                                v9 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                v22 /*: any*/,
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
                      args: v49 /*: any*/,
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
                                  selections: v10 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v10 /*: any*/,
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
                      alias: "Warning_Profile",
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
                                v31 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: {
                                    or: [v32 /*: any*/, v41 /*: any*/],
                                  },
                                },
                                v34 /*: any*/,
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
                                v9 /*: any*/,
                                v36 /*: any*/,
                                v42 /*: any*/,
                                v37 /*: any*/,
                                v40 /*: any*/,
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
                      alias: "Warning_CostCategory",
                      args: v46 /*: any*/,
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
                              selections: [v9 /*: any*/, v47 /*: any*/, v48 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "Warning_Claims",
                      args: v8 /*: any*/,
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
                              selections: [v9 /*: any*/, v37 /*: any*/, v36 /*: any*/, v13 /*: any*/, v45 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "Warning_Project",
                      args: v17 /*: any*/,
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
                                v9 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v18 /*: any*/, v19 /*: any*/, v20 /*: any*/, v21 /*: any*/],
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: v24 /*: any*/,
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
                                          selections: [v9 /*: any*/, v29 /*: any*/],
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
                    v14 /*: any*/,
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
    },
    params: {
      cacheID: "bb8e07c7759a35cd278552f59edd962a",
      id: null,
      metadata: {},
      name: "ViewForecastQuery",
      operationKind: "query",
      text: 'query ViewForecastQuery(\n  $projectIdStr: String!\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...ForecastTableFragment\n      ...TitleFragment\n      ...WarningFragment\n      query {\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                isSalesforceSystemUser\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    Acc_NewForecastNeeded__c {\n                      value\n                    }\n                    Acc_OverheadRate__c {\n                      value\n                    }\n                    Acc_ForecastLastModifiedDate__c {\n                      value\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Total Project Period"}}}, {RecordType: {Name: {eq: "Claims Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment WarningFragment on UIAPI {\n  query {\n    Warning_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Profile Detail"}}}, {RecordType: {Name: {eq: "Total Cost Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 1000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    Warning_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n        }\n      }\n    }\n    Warning_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n        }\n      }\n    }\n    Warning_Project: Acc_Project__c(where: {Id: {eq: $projectId}}) {\n      edges {\n        node {\n          Id\n          roles {\n            isMo\n            isFc\n            isPm\n            partnerRoles {\n              isFc\n              isMo\n              isPm\n              partnerId\n            }\n          }\n          Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n            edges {\n              node {\n                Id\n                Acc_AccountId__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "e0abedea565161fbd55de448ef0d9c13";

export default node;
