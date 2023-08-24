/**
 * @generated SignedSource<<0ca8bb60e7fa2e7d1d2be5fec5add572>>
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
  projectIdStr?: string | null;
};
export type ClaimDetailsQuery$data = {
  readonly currentUser: {
    readonly userId: string | null;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
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
              readonly Acc_PeriodCoststobePaid__c: {
                readonly value: number | null;
              } | null;
              readonly Acc_ProjectPeriodCost__c: {
                readonly value: number | null;
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
              readonly Id: string;
              readonly RecordType: {
                readonly DeveloperName: {
                  readonly value: string | null;
                } | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
      };
      readonly " $fragmentSpreads": FragmentRefs<
        | "ClaimPeriodDateFragment"
        | "ClaimTableFragment"
        | "DocumentViewFragment"
        | "ForecastTableFragment"
        | "StatusChangesLogsFragment"
        | "TitleFragment"
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
          name: "userId",
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
    v11 = [
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
    v12 = {
      RecordType: {
        Name: {
          eq: "Total Project Period",
        },
      },
    },
    v13 = [
      v5 /*: any*/,
      v6 /*: any*/,
      {
        fields: [
          {
            items: [
              v7 /*: any*/,
              v10 /*: any*/,
              {
                fields: v11 /*: any*/,
                kind: "ObjectValue",
                name: "and.2",
              },
              {
                kind: "Literal",
                name: "and.3",
                value: v12 /*: any*/,
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
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "Id",
      storageKey: null,
    },
    v15 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "value",
      storageKey: null,
    },
    v16 = [v15 /*: any*/],
    v17 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Name",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v18 = [v17 /*: any*/],
    v19 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: v18 /*: any*/,
      storageKey: null,
    },
    v20 = {
      alias: "Claims",
      args: v13 /*: any*/,
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
                v19 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "PicklistValue",
                  kind: "LinkedField",
                  name: "Acc_ClaimStatus__c",
                  plural: false,
                  selections: [
                    v15 /*: any*/,
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
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_PeriodCoststobePaid__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_ProjectPeriodCost__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalCostsApproved__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalCostsSubmitted__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "CurrencyValue",
                  kind: "LinkedField",
                  name: "Acc_TotalDeferredAmount__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "BooleanValue",
                  kind: "LinkedField",
                  name: "Acc_FinalClaim__c",
                  plural: false,
                  selections: v16 /*: any*/,
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
    v21 = [
      {
        kind: "Variable",
        name: "eq",
        variableName: "projectId",
      },
    ],
    v22 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              {
                fields: [
                  {
                    fields: v21 /*: any*/,
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
    v23 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: v18 /*: any*/,
      storageKey: null,
    },
    v24 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v25 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v26 = {
      alias: null,
      args: v22 /*: any*/,
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
                v14 /*: any*/,
                v23 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "IDValue",
                  kind: "LinkedField",
                  name: "Acc_AccountId__c",
                  plural: false,
                  selections: v16 /*: any*/,
                  storageKey: null,
                },
                v24 /*: any*/,
                v25 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v27 = [
      {
        kind: "Literal",
        name: "first",
        value: 1,
      },
      {
        fields: [
          {
            fields: v21 /*: any*/,
            kind: "ObjectValue",
            name: "Id",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v28 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v30 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v31 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CompetitionType__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v32 = {
      alias: null,
      args: v27 /*: any*/,
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
                v14 /*: any*/,
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
                    v28 /*: any*/,
                    v29 /*: any*/,
                    v30 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "Ext_Partner_Roles",
                      kind: "LinkedField",
                      name: "partnerRoles",
                      plural: true,
                      selections: [
                        v28 /*: any*/,
                        v29 /*: any*/,
                        v30 /*: any*/,
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
    v33 = {
      fields: v9 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
    },
    v34 = {
      Acc_CostCategory__c: {
        ne: null,
      },
    },
    v35 = {
      kind: "Literal",
      name: "and.2",
      value: v34 /*: any*/,
    },
    v36 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v33 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: {
                  RecordType: {
                    Name: {
                      eq: "Profile Detail",
                    },
                  },
                },
              },
              v35 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v37 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v38 = [
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
            selections: [v14 /*: any*/, v37 /*: any*/],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v39 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v40 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v41 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v42 = [
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
              v14 /*: any*/,
              v37 /*: any*/,
              v39 /*: any*/,
              v40 /*: any*/,
              v41 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "CurrencyValue",
                kind: "LinkedField",
                name: "Acc_LatestForecastCost__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
              v19 /*: any*/,
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v43 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v33 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: {
                  RecordType: {
                    Name: {
                      eq: "Total Cost Category",
                    },
                  },
                },
              },
              v35 /*: any*/,
            ],
            kind: "ListValue",
            name: "and",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      },
    ],
    v44 = [
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
              v14 /*: any*/,
              v37 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "CurrencyValue",
                kind: "LinkedField",
                name: "Acc_CostCategoryGOLCost__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
              v19 /*: any*/,
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v45 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v46 = {
      RecordType: {
        Name: {
          eq: "Claims Detail",
        },
      },
    },
    v47 = [
      v5 /*: any*/,
      v6 /*: any*/,
      {
        fields: [
          {
            items: [
              v33 /*: any*/,
              {
                kind: "Literal",
                name: "and.1",
                value: v46 /*: any*/,
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
                value: v34 /*: any*/,
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
    v48 = {
      alias: null,
      args: null,
      concreteType: "CurrencyValue",
      kind: "LinkedField",
      name: "Acc_PeriodCostCategoryTotal__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v49 = [v5 /*: any*/],
    v50 = [
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
              v14 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "StringValue",
                kind: "LinkedField",
                name: "Acc_CostCategoryName__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "DoubleValue",
                kind: "LinkedField",
                name: "Acc_DisplayOrder__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "StringValue",
                kind: "LinkedField",
                name: "Acc_OrganisationType__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "PicklistValue",
                kind: "LinkedField",
                name: "Acc_CompetitionType__c",
                plural: false,
                selections: v16 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v51 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_OrganisationType__c",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    },
    v52 = {
      CreatedDate: {
        order: "DESC",
      },
    },
    v53 = {
      alias: null,
      args: null,
      concreteType: "DateTimeValue",
      kind: "LinkedField",
      name: "CreatedDate",
      plural: false,
      selections: v16 /*: any*/,
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, v3 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ClaimDetailsQuery",
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
                  name: "ForecastTableFragment",
                },
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
                  args: [
                    {
                      kind: "Literal",
                      name: "documentRecordType",
                      value: "Total Project Period",
                    },
                  ],
                  kind: "FragmentSpread",
                  name: "DocumentViewFragment",
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
                  selections: [v20 /*: any*/, v26 /*: any*/, v32 /*: any*/],
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
                      alias: "ForecastTable_ProfileForCostCategory",
                      args: v36 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v38 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_ForecastDetails",
                      args: v36 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v42 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_GolCosts",
                      args: v43 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v44 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_AllClaimsForPartner",
                      args: [
                        v5 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v33 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.1",
                                  value: v12 /*: any*/,
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
                              selections: [v19 /*: any*/, v14 /*: any*/, v45 /*: any*/, v39 /*: any*/],
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
                      args: v47 /*: any*/,
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
                                v19 /*: any*/,
                                v37 /*: any*/,
                                v45 /*: any*/,
                                v48 /*: any*/,
                                v41 /*: any*/,
                                v39 /*: any*/,
                                v40 /*: any*/,
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
                        v5 /*: any*/,
                        {
                          fields: [
                            {
                              items: [
                                v7 /*: any*/,
                                v10 /*: any*/,
                                {
                                  kind: "Literal",
                                  name: "and.2",
                                  value: {
                                    or: [v12 /*: any*/, v46 /*: any*/],
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
                                v19 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                v39 /*: any*/,
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
                      args: v49 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v50 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ForecastTable_Partner",
                      args: v22 /*: any*/,
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
                                v14 /*: any*/,
                                v23 /*: any*/,
                                v24 /*: any*/,
                                v51 /*: any*/,
                                v25 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PercentValue",
                                  kind: "LinkedField",
                                  name: "Acc_OverheadRate__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
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
                      alias: "ForecastTable_Project",
                      args: v27 /*: any*/,
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
                                v14 /*: any*/,
                                v31 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_CurrentPeriodNumber__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
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
                      alias: "ClaimTable_ProfileForCostCategory",
                      args: v36 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v38 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ForecastDetails",
                      args: v36 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v42 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_GolCosts",
                      args: v43 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v44 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ClaimDetails",
                      args: v47 /*: any*/,
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
                                v19 /*: any*/,
                                v37 /*: any*/,
                                v48 /*: any*/,
                                v41 /*: any*/,
                                v39 /*: any*/,
                                v40 /*: any*/,
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
                      args: v49 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v50 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ClaimTable_Partner",
                      args: v22 /*: any*/,
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
                              selections: [v14 /*: any*/, v51 /*: any*/],
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
                      args: v27 /*: any*/,
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
                              selections: [v14 /*: any*/, v31 /*: any*/],
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
                      args: v27 /*: any*/,
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
                                v14 /*: any*/,
                                v31 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v29 /*: any*/, v30 /*: any*/, v28 /*: any*/],
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
                          value: v52 /*: any*/,
                        },
                        {
                          fields: [
                            {
                              fields: [
                                {
                                  items: [
                                    v33 /*: any*/,
                                    {
                                      fields: v11 /*: any*/,
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
                                v14 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "TextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_NewClaimStatus__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "LongTextAreaValue",
                                  kind: "LinkedField",
                                  name: "Acc_ExternalComment__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_ParticipantVisibility__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_CreatedByAlias__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                v53 /*: any*/,
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
                      alias: "DocumentView_Claims",
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
                                  fields: [
                                    {
                                      fields: [
                                        {
                                          fields: [
                                            {
                                              kind: "Literal",
                                              name: "eq",
                                              value: "Total Project Period",
                                            },
                                          ],
                                          kind: "ObjectValue",
                                          name: "Name",
                                        },
                                      ],
                                      kind: "ObjectValue",
                                      name: "RecordType",
                                    },
                                  ],
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
                                v14 /*: any*/,
                                v39 /*: any*/,
                                v37 /*: any*/,
                                v19 /*: any*/,
                                {
                                  alias: null,
                                  args: [
                                    v5 /*: any*/,
                                    {
                                      kind: "Literal",
                                      name: "orderBy",
                                      value: {
                                        ContentDocument: v52 /*: any*/,
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
                                            v14 /*: any*/,
                                            {
                                              alias: null,
                                              args: null,
                                              concreteType: "IDValue",
                                              kind: "LinkedField",
                                              name: "LinkedEntityId",
                                              plural: false,
                                              selections: v16 /*: any*/,
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
                                              concreteType: "ContentDocument",
                                              kind: "LinkedField",
                                              name: "ContentDocument",
                                              plural: false,
                                              selections: [
                                                v14 /*: any*/,
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
                                                      selections: v16 /*: any*/,
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
                                                  selections: v16 /*: any*/,
                                                  storageKey: null,
                                                },
                                                v53 /*: any*/,
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "IDValue",
                                                  kind: "LinkedField",
                                                  name: "LatestPublishedVersionId",
                                                  plural: false,
                                                  selections: v16 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "StringValue",
                                                  kind: "LinkedField",
                                                  name: "FileExtension",
                                                  plural: false,
                                                  selections: v16 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "StringValue",
                                                  kind: "LinkedField",
                                                  name: "Title",
                                                  plural: false,
                                                  selections: v16 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "IntValue",
                                                  kind: "LinkedField",
                                                  name: "ContentSize",
                                                  plural: false,
                                                  selections: v16 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "User",
                                                  kind: "LinkedField",
                                                  name: "CreatedBy",
                                                  plural: false,
                                                  selections: [
                                                    v17 /*: any*/,
                                                    {
                                                      alias: null,
                                                      args: null,
                                                      concreteType: "StringValue",
                                                      kind: "LinkedField",
                                                      name: "Username",
                                                      plural: false,
                                                      selections: v16 /*: any*/,
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
                    {
                      alias: "Title_Project",
                      args: v27 /*: any*/,
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
                                  selections: v16 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "StringValue",
                                  kind: "LinkedField",
                                  name: "Acc_ProjectTitle__c",
                                  plural: false,
                                  selections: v16 /*: any*/,
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
                      args: v13 /*: any*/,
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
                              selections: [v14 /*: any*/, v19 /*: any*/, v41 /*: any*/, v40 /*: any*/, v39 /*: any*/],
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
                      args: v22 /*: any*/,
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
                              selections: [v14 /*: any*/, v23 /*: any*/, v24 /*: any*/, v25 /*: any*/],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    v20 /*: any*/,
                    v26 /*: any*/,
                    v32 /*: any*/,
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
      cacheID: "881dd099b3ed38f2fd388ac6bd93f313",
      id: null,
      metadata: {},
      name: "ClaimDetailsQuery",
      operationKind: "query",
      text: 'query ClaimDetailsQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    userId\n  }\n  salesforce {\n    uiapi {\n      ...ForecastTableFragment\n      ...ClaimTableFragment\n      ...StatusChangesLogsFragment\n      ...DocumentViewFragment_1rqvqB\n      ...TitleFragment\n      ...ClaimPeriodDateFragment\n      query {\n        Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_ClaimStatus__c {\n                value\n                label\n              }\n              Acc_PeriodCoststobePaid__c {\n                value\n              }\n              Acc_ProjectPeriodCost__c {\n                value\n              }\n              Acc_TotalCostsApproved__c {\n                value\n              }\n              Acc_TotalCostsSubmitted__c {\n                value\n              }\n              Acc_TotalDeferredAmount__c {\n                value\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountId__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_ParticipantStatus__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                partnerRoles {\n                  isMo\n                  isFc\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimPeriodDateFragment on UIAPI {\n  query {\n    ClaimPeriodDate_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimPeriodDate_ProjectParticipant: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimTableFragment on UIAPI {\n  query {\n    ClaimTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_OrganisationType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment DocumentViewFragment_1rqvqB on UIAPI {\n  query {\n    DocumentView_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n          ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n            edges {\n              node {\n                Id\n                LinkedEntityId {\n                  value\n                }\n                isFeedAttachment\n                ContentDocument {\n                  Id\n                  LastModifiedBy {\n                    ContactId {\n                      value\n                    }\n                  }\n                  Description {\n                    value\n                  }\n                  CreatedDate {\n                    value\n                  }\n                  LatestPublishedVersionId {\n                    value\n                  }\n                  FileExtension {\n                    value\n                  }\n                  Title {\n                    value\n                  }\n                  ContentSize {\n                    value\n                  }\n                  CreatedBy {\n                    Name {\n                      value\n                    }\n                    Username {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Total Project Period"}}}, {RecordType: {Name: {eq: "Claims Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "9686254f60f3d9954019a9493c6f6697";

export default node;
