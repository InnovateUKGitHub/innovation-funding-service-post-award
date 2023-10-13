/**
 * @generated SignedSource<<829802e8c7d2610901300e380226e5ed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ClaimPrepareQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null;
};
export type ClaimPrepareQuery$data = {
  readonly currentUser: {
    readonly email: string | null;
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
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
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
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionId__r: {
                readonly Name: {
                  readonly value: string | null;
                } | null;
              } | null;
              readonly Acc_CompetitionType__c: {
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
            } | null;
          } | null> | null;
        } | null;
      };
      readonly " $fragmentSpreads": FragmentRefs<
        | "AwardRateOverridesMessageFragment"
        | "ClaimPeriodDateFragment"
        | "ClaimRetentionMessageFragment"
        | "ClaimTableFragment"
        | "StatusChangesLogsFragment"
        | "TitleFragment"
      >;
    };
  };
};
export type ClaimPrepareQuery = {
  response: ClaimPrepareQuery$data;
  variables: ClaimPrepareQuery$variables;
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
      alias: null,
      args: null,
      concreteType: "CurrentUserObject",
      kind: "LinkedField",
      name: "currentUser",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "email",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v5 = {
      kind: "Literal",
      name: "first",
      value: 2000,
    },
    v6 = {
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
    v7 = {
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
    v8 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "partnerId",
      },
    ],
    v9 = [
      {
        fields: v8 /*: any*/,
        kind: "ObjectValue",
        name: "Acc_ProjectParticipant__c",
      },
    ],
    v10 = {
      fields: v9 /*: any*/,
      kind: "ObjectValue",
      name: "and.1",
    },
    v11 = {
      RecordType: {
        Name: {
          eq: "Total Project Period",
        },
      },
    },
    v12 = {
      Acc_ClaimStatus__c: {
        ne: "New",
      },
    },
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "value",
      storageKey: null,
    },
    v15 = [v14 /*: any*/],
    v16 = [
      {
        alias: null,
        args: null,
        concreteType: "StringValue",
        kind: "LinkedField",
        name: "Name",
        plural: false,
        selections: v15 /*: any*/,
        storageKey: null,
      },
    ],
    v17 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v18 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: [
        v5 /*: any*/,
        v6 /*: any*/,
        {
          fields: [
            {
              items: [
                v7 /*: any*/,
                v10 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.2",
                  value: v11 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.3",
                  value: v12 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.4",
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
              selections: [
                v13 /*: any*/,
                v17 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ClaimStatus__c",
                  plural: false,
                  selections: [
                    v14 /*: any*/,
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
                v18 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v15 /*: any*/,
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
    v20 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v21 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              {
                fields: [
                  {
                    fields: v20 /*: any*/,
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
                    fields: v8 /*: any*/,
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
    ],
    v22 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v23 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v24 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v25 = {
      alias: null,
      args: v21 /*: any*/,
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
                v13 /*: any*/,
                v22 /*: any*/,
                {
                  kind: "Variable",
                  name: "eq",
                  variableName: "projectIdStr",
                },
                v23 /*: any*/,
                v24 /*: any*/,
              ],
              kind: "ObjectValue",
              name: "Acc_ProjectID__c",
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v26 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      {
        fields: [
          {
            fields: v20 /*: any*/,
            kind: "ObjectValue",
            name: "Id",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v27 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v28 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v30 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CompetitionType__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v31 = {
      alias: null,
      args: v26 /*: any*/,
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
              fields: [
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
                    v27 /*: any*/,
                    v28 /*: any*/,
                    v29 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Ext_Partner_Roles",
                      kind: "LinkedField",
                      name: "partnerRoles",
                      plural: true,
                      selections: [
                        v27 /*: any*/,
                        v28 /*: any*/,
                        v29 /*: any*/,
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
                    v21 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "CurrencyValue",
                      kind: "LinkedField",
                      name: "Acc_ProjectPeriodCost__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    v33 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "CurrencyValue",
                      kind: "LinkedField",
                      name: "Acc_PeriodCoststobePaid__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "CurrencyValue",
                      kind: "LinkedField",
                      name: "Acc_TotalCostsApproved__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "CurrencyValue",
                      kind: "LinkedField",
                      name: "Acc_TotalCostsSubmitted__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "CurrencyValue",
                      kind: "LinkedField",
                      name: "Acc_TotalDeferredAmount__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "BooleanValue",
                      kind: "LinkedField",
                      name: "Acc_FinalClaim__c",
                      plural: false,
                      selections: v15 /*: any*/,
                      storageKey: null,
                    },
                    v18 /*: any*/,
                  ],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "Competition__c",
                  kind: "LinkedField",
                  name: "Acc_CompetitionId__r",
                  plural: false,
                  selections: v16 /*: any*/,
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
    v32 = {
      fields: v9 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v33 = [
      {
        fields: [
          {
            kind: "Variable",
            name: "eq",
            variableName: "projectId",
          },
        ],
        kind: "ObjectValue",
        name: "Acc_ProjectPeriodNumber__c",
      },
    ],
    v34 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v35 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v36 = {
      RecordType: {
        Name: {
          eq: "Profile Detail",
        },
      },
    },
    v37 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v38 = {
      kind: "Literal",
      name: "and.2",
      value: v37 /*: any*/,
    },
    v39 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v32 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v36 /*: any*/,
              },
              v38 /*: any*/,
            ],
            kind: "ObjectValue",
            name: "where",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v40 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v41 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_LatestForecastCost__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v42 = {
      RecordType: {
        Name: {
          eq: "Total Cost Category",
        },
      },
    },
    v43 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryGOLCost__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v44 = [
      v5 /*: any*/,
      v6 /*: any*/,
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
                value: v12 /*: any*/,
              },
              {
                kind: "Literal",
                name: "and.3",
                value: v37 /*: any*/,
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
    v45 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v46 = [v5 /*: any*/],
    v47 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryName__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, v3 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ClaimPrepareQuery",
      selections: [
        v4 /*: any*/,
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
                  name: "TitleFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ClaimPeriodDateFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ClaimTableFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "ClaimRetentionMessageFragment",
                },
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "AwardRateOverridesMessageFragment",
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [v19 /*: any*/, v25 /*: any*/, v31 /*: any*/],
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
      name: "ClaimPrepareQuery",
      selections: [
        v4 /*: any*/,
        {
          fields: [
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
                      args: v26 /*: any*/,
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
                                v13 /*: any*/,
                                v30 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v28 /*: any*/, v29 /*: any*/, v27 /*: any*/],
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
                        v5 /*: any*/,
                        {
                          kind: "Literal",
                          name: "orderBy",
                          value: {
                            CreatedDate: {
                              order: "DESC",
                            },
                          },
                        },
                        {
                          fields: [
                            {
                              fields: [
                                {
                                  items: [
                                    v32 /*: any*/,
                                    {
                                      fields: v33 /*: any*/,
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
                                v13 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "TextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_NewClaimStatus__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "LongTextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_ExternalComment__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_ParticipantVisibility__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CreatedByAlias__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DateTimeValue",
                                  kind: "LinkedField",
                                  name: "CreatedDate",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      args: v26 /*: any*/,
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
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "ClaimPeriodDate_Claims",
                      args: [
                        v5 /*: any*/,
                        v6 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v7 /*: any*/,
                                v10 /*: any*/,
                                {
                                  fields: v33 /*: any*/,
                                  kind: "ObjectValue",
                                  name: "and.2",
                                },
                                {
                                  kind: "Literal",
                                  name: "and.3",
                                  value: v11 /*: any*/,
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
                              selections: [v13 /*: any*/, v17 /*: any*/, v34 /*: any*/, v35 /*: any*/, v18 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimPeriodDate_ProjectParticipant",
                      args: v21 /*: any*/,
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
                              selections: [v13 /*: any*/, v22 /*: any*/, v23 /*: any*/, v24 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ProfileForCostCategory",
                      args: v39 /*: any*/,
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
                              selections: [v13 /*: any*/, v40 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ForecastDetails",
                      args: v39 /*: any*/,
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
                                v13 /*: any*/,
                                v40 /*: any*/,
                                v18 /*: any*/,
                                v35 /*: any*/,
                                v34 /*: any*/,
                                v41 /*: any*/,
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
                      alias: "ClaimTable_GolCosts",
                      args: [
                        v5 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v42 /*: any*/,
                                },
                                v38 /*: any*/,
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
                              selections: [v13 /*: any*/, v40 /*: any*/, v43 /*: any*/, v17 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ClaimDetails",
                      args: v44 /*: any*/,
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
                                v17 /*: any*/,
                                v40 /*: any*/,
                                v45 /*: any*/,
                                v34 /*: any*/,
                                v18 /*: any*/,
                                v35 /*: any*/,
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
                      alias: "ClaimTable_CostCategory",
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
                                v13 /*: any*/,
                                v47 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_DisplayOrder__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_CompetitionType__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "ClaimTable_Partner",
                      args: v21 /*: any*/,
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
                                v13 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_OrganisationType__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "ClaimTable_Project",
                      args: v26 /*: any*/,
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
                              selections: [v13 /*: any*/, v30 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimRetentionMessage_ClaimDetails",
                      args: v44 /*: any*/,
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
                              selections: [v17 /*: any*/, v40 /*: any*/, v45 /*: any*/, v18 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "ClaimRetentionMessage_CostCategory",
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
                              selections: [v13 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ClaimRetentionMessage_Partner",
                      args: v21 /*: any*/,
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
                                v13 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "CurrencyValue",
                                  kind: "LinkedField",
                                  name: "Acc_StaticCapLimitGrant__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "CurrencyValue",
                                  kind: "LinkedField",
                                  name: "Acc_TotalApprovedCosts__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "AwardRateOverridesMessage_Project",
                      args: v26 /*: any*/,
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
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_NonFEC__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "AwardRateOverridesMessage_Profile",
                      args: [
                        v5 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v32 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: {
                                    or: [v36 /*: any*/, v42 /*: any*/],
                                  },
                                },
                                v38 /*: any*/,
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
                                v13 /*: any*/,
                                v17 /*: any*/,
                                v40 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Acc_CostCategory__c",
                                  kind: "LinkedField",
                                  name: "Acc_CostCategory__r",
                                  plural: false,
                                  selections: [v47 /*: any*/],
                                  storageKey: null,
                                },
                                v43 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PercentValue",
                                  kind: "LinkedField",
                                  name: "Acc_OverrideAwardRate__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                v18 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PercentValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProfileOverrideAwardRate__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                v35 /*: any*/,
                                v34 /*: any*/,
                                v41 /*: any*/,
                              ],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    v19 /*: any*/,
                    v25 /*: any*/,
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
      cacheID: "f309a7cd556719c8d95e0b9f58b0e9e4",
      id: null,
      metadata: {},
      name: "ClaimPrepareQuery",
      operationKind: "query",
      text: 'query ClaimPrepareQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    email\n  }\n  salesforce {\n    uiapi {\n      ...StatusChangesLogsFragment\n      ...TitleFragment\n      ...ClaimPeriodDateFragment\n      ...ClaimTableFragment\n      ...ClaimRetentionMessageFragment\n      ...AwardRateOverridesMessageFragment\n      query {\n        Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountId__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_CompetitionId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment AwardRateOverridesMessageFragment on UIAPI {\n  query {\n    AwardRateOverridesMessage_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_NonFEC__c {\n            value\n          }\n        }\n      }\n    }\n    AwardRateOverridesMessage_Profile: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Profile Detail"}}}, {RecordType: {Name: {eq: "Total Cost Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategory__r {\n            Acc_CostCategoryName__c {\n              value\n            }\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          Acc_OverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProfileOverrideAwardRate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimPeriodDateFragment on UIAPI {\n  query {\n    ClaimPeriodDate_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimPeriodDate_ProjectParticipant: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimRetentionMessageFragment on UIAPI {\n  query {\n    ClaimRetentionMessage_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimRetentionMessage_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n        }\n      }\n    }\n    ClaimRetentionMessage_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_StaticCapLimitGrant__c {\n            value\n          }\n          Acc_TotalApprovedCosts__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimTableFragment on UIAPI {\n  query {\n    ClaimTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_OrganisationType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "79e05e7ef8cfa4bc26cd04270bd1b0fa";

export default node;
