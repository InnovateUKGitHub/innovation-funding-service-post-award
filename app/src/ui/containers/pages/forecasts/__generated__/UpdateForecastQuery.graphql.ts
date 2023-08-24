/**
 * @generated SignedSource<<a9060d78d1824e9a579e46299a86d637>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type UpdateForecastQuery$variables = {
  partnerId: string;
  projectId: string;
  projectIdStr: string;
};
export type UpdateForecastQuery$data = {
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
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null;
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
              readonly Acc_ProjectParticipantsProject__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_ForecastLastModifiedDate__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_OverheadRate__c: {
                      readonly value: number | null;
                    } | null;
                    readonly Id: string;
                  } | null;
                } | null> | null;
              } | null;
              readonly Id: string;
              readonly isActive: boolean;
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
              };
            } | null;
          } | null> | null;
        } | null;
      };
      readonly " $fragmentSpreads": FragmentRefs<"ForecastTableFragment" | "ProjectTitleFragment" | "WarningFragment">;
    };
  };
};
export type UpdateForecastQuery = {
  response: UpdateForecastQuery$data;
  variables: UpdateForecastQuery$variables;
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
        Name: {
          eq: "Total Project Period",
        },
      },
    },
    v9 = {
      Acc_ClaimStatus__c: {
        ne: "New",
      },
    },
    v10 = {
      Acc_ClaimStatus__c: {
        ne: "Not used",
      },
    },
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v12 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "value",
        storageKey: null,
      },
    ],
    v13 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v14 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v15 = [
      {
        alias: null,
        args: null,
        concreteType: "StringValue",
        kind: "LinkedField",
        name: "Name",
        plural: false,
        selections: v12 /*: any*/,
        storageKey: null,
      },
    ],
    v16 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v17 = {
      alias: null,
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
                  value: v8 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.3",
                  value: v9 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.4",
                  value: v10 /*: any*/,
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
                v11 /*: any*/,
                v13 /*: any*/,
                v14 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v12 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "DateValue",
                  kind: "LinkedField",
                  name: "Acc_PaidDate__c",
                  plural: false,
                  selections: v12 /*: any*/,
                  storageKey: null,
                },
                v16 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v18 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v19 = {
      fields: [
        {
          fields: v18 /*: any*/,
          kind: "ObjectValue",
          name: "Id",
        },
      ],
      kind: "ObjectValue",
      name: "where",
    },
    v20 = [v19 /*: any*/],
    v21 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v22 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v23 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
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
      concreteType: "PercentValue",
      kind: "LinkedField",
      name: "Acc_OverheadRate__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v27 = {
      alias: null,
      args: v20 /*: any*/,
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
                v11 /*: any*/,
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
                  selections: [v21 /*: any*/, v22 /*: any*/, v23 /*: any*/],
                  storageKey: null,
                },
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
                            v11 /*: any*/,
                            v26 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              concreteType: "DateTimeValue",
                              kind: "LinkedField",
                              name: "Acc_ForecastLastModifiedDate__c",
                              plural: false,
                              selections: v12 /*: any*/,
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
      ],
      storageKey: null,
    },
    v28 = {
      fields: v6 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v29 = {
      RecordType: {
        Name: {
          eq: "Profile Detail",
        },
      },
    },
    v30 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v31 = {
      kind: "Literal",
      name: "and.2",
      value: v30 /*: any*/,
    },
    v32 = [
      v3 /*: any*/,
      {
        fields: [
          {
            items: [
              v28 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v29 /*: any*/,
              },
              v31 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v33 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v34 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v35 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v36 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_LatestForecastCost__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v37 = {
      RecordType: {
        Name: {
          eq: "Total Cost Category",
        },
      },
    },
    v38 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryGOLCost__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v39 = {
      RecordType: {
        Name: {
          eq: "Claims Detail",
        },
      },
    },
    v40 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v41 = [v3 /*: any*/],
    v42 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryName__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v43 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_DisplayOrder__c",
      plural: false,
      selections: v12 /*: any*/,
      storageKey: null,
    },
    v44 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      v19 /*: any*/,
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "UpdateForecastQuery",
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
                  name: "WarningFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ProjectTitleFragment",
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [v17 /*: any*/, v27 /*: any*/],
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
      name: "UpdateForecastQuery",
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
                      args: v32 /*: any*/,
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
                              selections: [v11 /*: any*/, v33 /*: any*/],
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
                      args: v32 /*: any*/,
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
                                v11 /*: any*/,
                                v33 /*: any*/,
                                v14 /*: any*/,
                                v34 /*: any*/,
                                v35 /*: any*/,
                                v36 /*: any*/,
                                v16 /*: any*/,
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
                                v28 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v37 /*: any*/,
                                },
                                v31 /*: any*/,
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
                              selections: [v11 /*: any*/, v33 /*: any*/, v38 /*: any*/, v16 /*: any*/],
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
                                v28 /*: any*/,
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
                                  value: v10 /*: any*/,
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
                              selections: [v16 /*: any*/, v11 /*: any*/, v13 /*: any*/, v14 /*: any*/],
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
                                v28 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v39 /*: any*/,
                                },
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: v9 /*: any*/,
                                },
                                {
                                  kind: "Literal",
                                  name: "and.3",
                                  value: v30 /*: any*/,
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
                                v16 /*: any*/,
                                v33 /*: any*/,
                                v13 /*: any*/,
                                v40 /*: any*/,
                                v35 /*: any*/,
                                v14 /*: any*/,
                                v34 /*: any*/,
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
                                    or: [v8 /*: any*/, v39 /*: any*/],
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
                                v16 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
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
                    {
                      alias: "ForecastTable_CostCategory",
                      args: v41 /*: any*/,
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
                                v11 /*: any*/,
                                v42 /*: any*/,
                                v43 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
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
                                      fields: v18 /*: any*/,
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
                                v11 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Account",
                                  kind: "LinkedField",
                                  name: "Acc_AccountId__r",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectRole__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ParticipantStatus__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                v26 /*: any*/,
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
                                v11 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_CurrentPeriodNumber__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
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
                                v28 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: {
                                    or: [v29 /*: any*/, v37 /*: any*/],
                                  },
                                },
                                v31 /*: any*/,
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
                                v11 /*: any*/,
                                v33 /*: any*/,
                                v38 /*: any*/,
                                v14 /*: any*/,
                                v36 /*: any*/,
                                v16 /*: any*/,
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
                      args: v41 /*: any*/,
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
                              selections: [v11 /*: any*/, v42 /*: any*/, v43 /*: any*/],
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
                      args: [
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
                              selections: [v11 /*: any*/, v14 /*: any*/, v33 /*: any*/, v16 /*: any*/, v40 /*: any*/],
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
                      args: v20 /*: any*/,
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
                                v11 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [
                                    v21 /*: any*/,
                                    v22 /*: any*/,
                                    v23 /*: any*/,
                                    {
                                      alias: null,
                                      args: null,
                                      concreteType: "Ext_Partner_Roles",
                                      kind: "LinkedField",
                                      name: "partnerRoles",
                                      plural: true,
                                      selections: [
                                        v22 /*: any*/,
                                        v21 /*: any*/,
                                        v23 /*: any*/,
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
                                            v11 /*: any*/,
                                            {
                                              alias: null,
                                              args: null,
                                              concreteType: "IDValue",
                                              kind: "LinkedField",
                                              name: "Acc_AccountId__c",
                                              plural: false,
                                              selections: v12 /*: any*/,
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
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ProjectTitle_Project",
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
                                  selections: v12 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v12 /*: any*/,
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
                    v17 /*: any*/,
                    v27 /*: any*/,
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
      cacheID: "952fef5139ab3d60377593293480da30",
      id: null,
      metadata: {},
      name: "UpdateForecastQuery",
      operationKind: "query",
      text: 'query UpdateForecastQuery(\n  $projectIdStr: String!\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...ForecastTableFragment\n      ...WarningFragment\n      ...ProjectTitleFragment\n      query {\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ClaimStatus__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n              Acc_PaidDate__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n              }\n              Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_OverheadRate__c {\n                      value\n                    }\n                    Acc_ForecastLastModifiedDate__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Total Project Period"}}}, {RecordType: {Name: {eq: "Claims Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectTitleFragment on UIAPI {\n  query {\n    ProjectTitle_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment WarningFragment on UIAPI {\n  query {\n    Warning_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Profile Detail"}}}, {RecordType: {Name: {eq: "Total Cost Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 1000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    Warning_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n        }\n      }\n    }\n    Warning_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n        }\n      }\n    }\n    Warning_Project: Acc_Project__c(where: {Id: {eq: $projectId}}) {\n      edges {\n        node {\n          Id\n          roles {\n            isMo\n            isFc\n            isPm\n            partnerRoles {\n              isFc\n              isMo\n              isPm\n              partnerId\n            }\n          }\n          Acc_ProjectParticipantsProject__r(where: {Id: {eq: $partnerId}}, first: 500) {\n            edges {\n              node {\n                Id\n                Acc_AccountId__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "8804b920e4b9dba0e47e8a25fda7195c";

export default node;
