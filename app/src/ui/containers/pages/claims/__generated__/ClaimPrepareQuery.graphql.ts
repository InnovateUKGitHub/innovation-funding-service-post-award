/**
 * @generated SignedSource<<91588a4c75f49e5d08dfdc01af0fca87>>
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
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AccountId__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ParticipantStatus__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_StaticCapLimitGrant__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_TotalApprovedCosts__c: {
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
              readonly Acc_NonFEC__c: {
                readonly value: boolean | null;
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
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_Grant_Paid_To_Date__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_PeriodCostCategoryTotal__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null;
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
        readonly ClaimOverrides: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategory__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CostCategory__r: {
                readonly Acc_CostCategoryName__c: {
                  readonly value: string | null;
                } | null;
              } | null;
              readonly Acc_OverrideAwardRate__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProfileOverrideAwardRate__c: {
                readonly value: number | null;
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
        readonly Claims: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ClaimStatus__c: {
                readonly label: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
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
      };
      readonly " $fragmentSpreads": FragmentRefs<
        "ClaimPeriodDateFragment" | "ClaimTableFragment" | "StatusChangesLogsFragment" | "TitleFragment"
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
    v6 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "partnerId",
      },
    ],
    v7 = [
      {
        fields: v6 /*: any*/,
        kind: "ObjectValue",
        name: "Acc_ProjectParticipant__c",
      },
    ],
    v8 = {
      fields: v7 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v9 = {
      RecordType: {
        Name: {
          eq: "Profile Detail",
        },
      },
    },
    v10 = {
      RecordType: {
        Name: {
          eq: "Total Cost Category",
        },
      },
    },
    v11 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v12 = {
      kind: "Literal",
      name: "and.2",
      value: v11 /*: any*/,
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
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v19 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CostCategoryName__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v20 = {
      alias: "ClaimOverrides",
      args: [
        v5 /*: any*/,
        {
          fields: [
            {
              items: [
                v8 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.1",
                  value: {
                    or: [v9 /*: any*/, v10 /*: any*/],
                  },
                },
                v12 /*: any*/,
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
                v18 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "Acc_CostCategory__c",
                  kind: "LinkedField",
                  name: "Acc_CostCategory__r",
                  plural: false,
                  selections: [v19 /*: any*/],
                  storageKey: null,
                },
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
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v21 = {
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
    v22 = {
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
    v23 = {
      fields: v7 /*: any*/,
      kind: "ObjectValue",
      name: "and.1",
    },
    v24 = {
      RecordType: {
        Name: {
          eq: "Claims Detail",
        },
      },
    },
    v25 = {
      Acc_ClaimStatus__c: {
        ne: "New",
      },
    },
    v26 = {
      Acc_ClaimStatus__c: {
        ne: "Not used",
      },
    },
    v27 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v28 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v29 = {
      alias: "ClaimDetails",
      args: [
        v5 /*: any*/,
        v21 /*: any*/,
        {
          fields: [
            {
              items: [
                v22 /*: any*/,
                v23 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.2",
                  value: v24 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.3",
                  value: v25 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.4",
                  value: v26 /*: any*/,
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
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_Grant_Paid_To_Date__c",
                  plural: false,
                  selections: v15 /*: any*/,
                  storageKey: null,
                },
                v27 /*: any*/,
                v28 /*: any*/,
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
    v30 = [
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
    v31 = {
      fields: v30 /*: any*/,
      kind: "ObjectValue",
      name: "and.2",
    },
    v32 = {
      kind: "Literal",
      name: "and.3",
      value: {
        RecordType: {
          Name: {
            eq: "Total Project Period",
          },
        },
      },
    },
    v33 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v34 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v35 = {
      alias: "Claims",
      args: [
        v5 /*: any*/,
        v21 /*: any*/,
        {
          fields: [
            {
              items: [
                v22 /*: any*/,
                v23 /*: any*/,
                v31 /*: any*/,
                v32 /*: any*/,
                {
                  kind: "Literal",
                  name: "and.4",
                  value: v25 /*: any*/,
                },
                {
                  kind: "Literal",
                  name: "and.5",
                  value: v26 /*: any*/,
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
                v33 /*: any*/,
                v34 /*: any*/,
                v27 /*: any*/,
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
    v36 = [v5 /*: any*/],
    v37 = [
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
              v19 /*: any*/,
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
    v38 = {
      alias: null,
      args: v36 /*: any*/,
      concreteType: "Acc_CostCategory__cConnection",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v37 /*: any*/,
      storageKey: "Acc_CostCategory__c(first:2000)",
    },
    v39 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v40 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              {
                fields: [
                  {
                    fields: v39 /*: any*/,
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
                    fields: v6 /*: any*/,
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
    v41 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v42 = {
      alias: null,
      args: v40 /*: any*/,
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
                  concreteType: "IDValue",
                  kind: "LinkedField",
                  name: "Acc_AccountId__c",
                  plural: false,
                  selections: v15 /*: any*/,
                  storageKey: null,
                },
                v41 /*: any*/,
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
    v43 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      {
        fields: [
          {
            fields: v39 /*: any*/,
            kind: "ObjectValue",
            name: "Id",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v44 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v45 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v46 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v47 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CompetitionType__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v48 = {
      alias: null,
      args: v43 /*: any*/,
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
                    v44 /*: any*/,
                    v45 /*: any*/,
                    v46 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Ext_Partner_Roles",
                      kind: "LinkedField",
                      name: "partnerRoles",
                      plural: true,
                      selections: [
                        v44 /*: any*/,
                        v45 /*: any*/,
                        v46 /*: any*/,
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
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_NonFEC__c",
                  plural: false,
                  selections: v15 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ProjectStatus__c",
                  plural: false,
                  selections: v15 /*: any*/,
                  storageKey: null,
                },
                v47 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v49 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v8 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v9 /*: any*/,
              },
              v12 /*: any*/,
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
                  name: "ClaimTableFragment",
                },
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
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [
                    v20 /*: any*/,
                    v29 /*: any*/,
                    v35 /*: any*/,
                    v38 /*: any*/,
                    v42 /*: any*/,
                    v48 /*: any*/,
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
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [
                    {
                      alias: "ClaimTable_ProfileForCostCategory",
                      args: v49 /*: any*/,
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
                              selections: [v13 /*: any*/, v18 /*: any*/],
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
                      args: v49 /*: any*/,
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
                                v18 /*: any*/,
                                v27 /*: any*/,
                                v34 /*: any*/,
                                v33 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "CurrencyValue",
                                  kind: "LinkedField",
                                  name: "Acc_LatestForecastCost__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "ClaimTable_GolCosts",
                      args: [
                        v5 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v8 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v10 /*: any*/,
                                },
                                v12 /*: any*/,
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
                                v18 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "CurrencyValue",
                                  kind: "LinkedField",
                                  name: "Acc_CostCategoryGOLCost__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                      alias: "ClaimTable_ClaimDetails",
                      args: [
                        v5 /*: any*/,
                        v21 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v8 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v24 /*: any*/,
                                },
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: v25 /*: any*/,
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
                              selections: [
                                v17 /*: any*/,
                                v18 /*: any*/,
                                v28 /*: any*/,
                                v33 /*: any*/,
                                v27 /*: any*/,
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
                      alias: "ClaimTable_CostCategory",
                      args: v36 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v37 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ClaimTable_Partner",
                      args: v40 /*: any*/,
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
                      args: v43 /*: any*/,
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
                              selections: [v13 /*: any*/, v47 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: "StatusChanges_Project",
                      args: v43 /*: any*/,
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
                                v47 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v45 /*: any*/, v46 /*: any*/, v44 /*: any*/],
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
                                    v8 /*: any*/,
                                    {
                                      fields: v30 /*: any*/,
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
                      args: v43 /*: any*/,
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
                        v21 /*: any*/,
                        {
                          fields: [
                            {
                              items: [v22 /*: any*/, v23 /*: any*/, v31 /*: any*/, v32 /*: any*/],
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
                              selections: [v13 /*: any*/, v17 /*: any*/, v33 /*: any*/, v34 /*: any*/, v27 /*: any*/],
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
                      args: v40 /*: any*/,
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
                                  concreteType: "Account",
                                  kind: "LinkedField",
                                  name: "Acc_AccountId__r",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectRole__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
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
                    v20 /*: any*/,
                    v29 /*: any*/,
                    v35 /*: any*/,
                    v38 /*: any*/,
                    v42 /*: any*/,
                    v48 /*: any*/,
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
      cacheID: "3bad89a966b82f50a668cf84b121e8aa",
      id: null,
      metadata: {},
      name: "ClaimPrepareQuery",
      operationKind: "query",
      text: 'query ClaimPrepareQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    email\n  }\n  salesforce {\n    uiapi {\n      ...ClaimTableFragment\n      ...StatusChangesLogsFragment\n      ...TitleFragment\n      ...ClaimPeriodDateFragment\n      query {\n        ClaimOverrides: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Profile Detail"}}}, {RecordType: {Name: {eq: "Total Cost Category"}}}]}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_CostCategory__c {\n                value\n              }\n              Acc_CostCategory__r {\n                Acc_CostCategoryName__c {\n                  value\n                }\n              }\n              Acc_OverrideAwardRate__c {\n                value\n              }\n              Acc_ProfileOverrideAwardRate__c {\n                value\n              }\n            }\n          }\n        }\n        ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_Grant_Paid_To_Date__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_PeriodCostCategoryTotal__c {\n                value\n              }\n              Acc_CostCategory__c {\n                value\n              }\n            }\n          }\n        }\n        Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_ProjectPeriodEndDate__c {\n                value\n              }\n              Acc_ProjectPeriodStartDate__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_CostCategory__c(first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n              Acc_StaticCapLimitGrant__c {\n                value\n              }\n              Acc_TotalApprovedCosts__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_NonFEC__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimPeriodDateFragment on UIAPI {\n  query {\n    ClaimPeriodDate_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimPeriodDate_ProjectParticipant: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimTableFragment on UIAPI {\n  query {\n    ClaimTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_OrganisationType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "3abbd236956b4de2cd896983a5d77e93";

export default node;
