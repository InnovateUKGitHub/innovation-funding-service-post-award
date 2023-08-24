/**
 * @generated SignedSource<<bf9f3c787029a33b1aa11a6b72707b8e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ClaimReviewQuery$variables = {
  partnerId: string;
  periodId: number;
  projectId: string;
  projectIdStr?: string | null;
};
export type ClaimReviewQuery$data = {
  readonly currentUser: {
    readonly userId: string | null;
  };
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
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
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
              };
            } | null;
          } | null> | null;
        } | null;
        readonly Claims: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_FinalClaim__c: {
                readonly value: boolean | null;
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
export type ClaimReviewQuery = {
  response: ClaimReviewQuery$data;
  variables: ClaimReviewQuery$variables;
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
    v15 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "value",
        storageKey: null,
      },
    ],
    v16 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Name",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v17 = [v16 /*: any*/],
    v18 = {
      alias: null,
      args: null,
      concreteType: "RecordType",
      kind: "LinkedField",
      name: "RecordType",
      plural: false,
      selections: v17 /*: any*/,
      storageKey: null,
    },
    v19 = {
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
    v22 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isMo",
      storageKey: null,
    },
    v23 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isFc",
      storageKey: null,
    },
    v24 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isPm",
      storageKey: null,
    },
    v25 = {
      alias: null,
      args: null,
      concreteType: "StringValue",
      kind: "LinkedField",
      name: "Acc_CompetitionType__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v26 = {
      alias: null,
      args: v21 /*: any*/,
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
                  concreteType: "Ext_Project_Roles",
                  kind: "LinkedField",
                  name: "roles",
                  plural: false,
                  selections: [v22 /*: any*/, v23 /*: any*/, v24 /*: any*/],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: "Competition__c",
                  kind: "LinkedField",
                  name: "Acc_CompetitionId__r",
                  plural: false,
                  selections: v17 /*: any*/,
                  storageKey: null,
                },
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
    v27 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodEndDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v28 = {
      alias: null,
      args: null,
      concreteType: "DateValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodStartDate__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v29 = {
      alias: null,
      args: null,
      concreteType: "DoubleValue",
      kind: "LinkedField",
      name: "Acc_ProjectPeriodNumber__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v30 = [
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
    v31 = {
      alias: null,
      args: null,
      concreteType: "Account",
      kind: "LinkedField",
      name: "Acc_AccountId__r",
      plural: false,
      selections: v17 /*: any*/,
      storageKey: null,
    },
    v32 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ProjectRole__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v33 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ParticipantStatus__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v34 = {
      fields: v9 /*: any*/,
      kind: "ObjectValue",
      name: "and.0",
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
    v37 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v34 /*: any*/,
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
    v38 = {
      alias: null,
      args: null,
      concreteType: "IDValue",
      kind: "LinkedField",
      name: "Acc_CostCategory__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v39 = [
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
            selections: [v14 /*: any*/, v38 /*: any*/],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v40 = [
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
              v38 /*: any*/,
              v29 /*: any*/,
              v28 /*: any*/,
              v27 /*: any*/,
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
              v18 /*: any*/,
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v41 = [
      v5 /*: any*/,
      {
        fields: [
          {
            items: [
              v34 /*: any*/,
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
              v38 /*: any*/,
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
              v18 /*: any*/,
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v43 = {
      RecordType: {
        Name: {
          eq: "Claims Detail",
        },
      },
    },
    v44 = [
      v5 /*: any*/,
      v6 /*: any*/,
      {
        fields: [
          {
            items: [
              v34 /*: any*/,
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
    v47 = [
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
                selections: v15 /*: any*/,
                storageKey: null,
              },
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
    v48 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_OrganisationType__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v49 = {
      alias: null,
      args: null,
      concreteType: "PicklistValue",
      kind: "LinkedField",
      name: "Acc_ClaimStatus__c",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    },
    v50 = {
      CreatedDate: {
        order: "DESC",
      },
    },
    v51 = {
      alias: null,
      args: null,
      concreteType: "DateTimeValue",
      kind: "LinkedField",
      name: "CreatedDate",
      plural: false,
      selections: v15 /*: any*/,
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, v3 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ClaimReviewQuery",
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
                  name: "ForecastTableFragment",
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
                  alias: null,
                  args: null,
                  concreteType: "RecordQuery",
                  kind: "LinkedField",
                  name: "query",
                  plural: false,
                  selections: [v19 /*: any*/, v26 /*: any*/],
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
      name: "ClaimReviewQuery",
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
                      alias: "Title_Project",
                      args: v21 /*: any*/,
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
                              selections: [v14 /*: any*/, v18 /*: any*/, v27 /*: any*/, v28 /*: any*/, v29 /*: any*/],
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
                      args: v30 /*: any*/,
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
                              selections: [v14 /*: any*/, v31 /*: any*/, v32 /*: any*/, v33 /*: any*/],
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
                      args: v37 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v39 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_ForecastDetails",
                      args: v37 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v40 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ClaimTable_GolCosts",
                      args: v41 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v42 /*: any*/,
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
                                v18 /*: any*/,
                                v38 /*: any*/,
                                v45 /*: any*/,
                                v27 /*: any*/,
                                v29 /*: any*/,
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
                      alias: "ClaimTable_CostCategory",
                      args: v46 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v47 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ClaimTable_Partner",
                      args: v30 /*: any*/,
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
                              selections: [v14 /*: any*/, v48 /*: any*/],
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
                      args: v21 /*: any*/,
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
                              selections: [v14 /*: any*/, v25 /*: any*/],
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
                      args: v37 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v39 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_ForecastDetails",
                      args: v37 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v40 /*: any*/,
                      storageKey: null,
                    },
                    {
                      alias: "ForecastTable_GolCosts",
                      args: v41 /*: any*/,
                      concreteType: "Acc_Profile__cConnection",
                      kind: "LinkedField",
                      name: "Acc_Profile__c",
                      plural: false,
                      selections: v42 /*: any*/,
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
                                v34 /*: any*/,
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
                              selections: [v18 /*: any*/, v14 /*: any*/, v49 /*: any*/, v29 /*: any*/],
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
                                v18 /*: any*/,
                                v38 /*: any*/,
                                v49 /*: any*/,
                                v45 /*: any*/,
                                v27 /*: any*/,
                                v29 /*: any*/,
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
                                    or: [v12 /*: any*/, v43 /*: any*/],
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
                                v18 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_IAR_Status__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "BooleanValue",
                                  kind: "LinkedField",
                                  name: "Acc_IARRequired__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
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
                    {
                      alias: "ForecastTable_CostCategory",
                      args: v46 /*: any*/,
                      concreteType: "Acc_CostCategory__cConnection",
                      kind: "LinkedField",
                      name: "Acc_CostCategory__c",
                      plural: false,
                      selections: v47 /*: any*/,
                      storageKey: "Acc_CostCategory__c(first:2000)",
                    },
                    {
                      alias: "ForecastTable_Partner",
                      args: v30 /*: any*/,
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
                                v31 /*: any*/,
                                v32 /*: any*/,
                                v48 /*: any*/,
                                v33 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PercentValue",
                                  kind: "LinkedField",
                                  name: "Acc_OverheadRate__c",
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
                      alias: "ForecastTable_Project",
                      args: v21 /*: any*/,
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
                                v25 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_NumberofPeriods__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PicklistValue",
                                  kind: "LinkedField",
                                  name: "Acc_ClaimFrequency__c",
                                  plural: false,
                                  selections: v15 /*: any*/,
                                  storageKey: null,
                                },
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "DoubleValue",
                                  kind: "LinkedField",
                                  name: "Acc_CurrentPeriodNumber__c",
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
                      alias: "StatusChanges_Project",
                      args: v21 /*: any*/,
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
                                v25 /*: any*/,
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "Ext_Project_Roles",
                                  kind: "LinkedField",
                                  name: "roles",
                                  plural: false,
                                  selections: [v23 /*: any*/, v24 /*: any*/, v22 /*: any*/],
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
                          value: v50 /*: any*/,
                        },
                        {
                          fields: [
                            {
                              fields: [
                                {
                                  items: [
                                    v34 /*: any*/,
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
                                v29 /*: any*/,
                                v38 /*: any*/,
                                v18 /*: any*/,
                                {
                                  alias: null,
                                  args: [
                                    v5 /*: any*/,
                                    {
                                      kind: "Literal",
                                      name: "orderBy",
                                      value: {
                                        ContentDocument: v50 /*: any*/,
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
                                              selections: v15 /*: any*/,
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
                                                      selections: v15 /*: any*/,
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
                                                  selections: v15 /*: any*/,
                                                  storageKey: null,
                                                },
                                                v51 /*: any*/,
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "IDValue",
                                                  kind: "LinkedField",
                                                  name: "LatestPublishedVersionId",
                                                  plural: false,
                                                  selections: v15 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "StringValue",
                                                  kind: "LinkedField",
                                                  name: "FileExtension",
                                                  plural: false,
                                                  selections: v15 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "StringValue",
                                                  kind: "LinkedField",
                                                  name: "Title",
                                                  plural: false,
                                                  selections: v15 /*: any*/,
                                                  storageKey: null,
                                                },
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: "IntValue",
                                                  kind: "LinkedField",
                                                  name: "ContentSize",
                                                  plural: false,
                                                  selections: v15 /*: any*/,
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
                                                    v16 /*: any*/,
                                                    {
                                                      alias: null,
                                                      args: null,
                                                      concreteType: "StringValue",
                                                      kind: "LinkedField",
                                                      name: "Username",
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
                    v19 /*: any*/,
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
      ],
    },
    params: {
      cacheID: "7750ffe1a52b90c78ad30248b87fb943",
      id: null,
      metadata: {},
      name: "ClaimReviewQuery",
      operationKind: "query",
      text: 'query ClaimReviewQuery(\n  $projectId: ID!\n  $projectIdStr: String\n  $partnerId: ID!\n  $periodId: Double!\n) {\n  currentUser {\n    userId\n  }\n  salesforce {\n    uiapi {\n      ...TitleFragment\n      ...ClaimPeriodDateFragment\n      ...ClaimTableFragment\n      ...ForecastTableFragment\n      ...StatusChangesLogsFragment\n      ...DocumentViewFragment_1rqvqB\n      query {\n        Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n              }\n              Acc_FinalClaim__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n              }\n              Acc_CompetitionId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimPeriodDateFragment on UIAPI {\n  query {\n    ClaimPeriodDate_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimPeriodDate_ProjectParticipant: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ClaimTableFragment on UIAPI {\n  query {\n    ClaimTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ClaimTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_OrganisationType__c {\n            value\n          }\n        }\n      }\n    }\n    ClaimTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment DocumentViewFragment_1rqvqB on UIAPI {\n  query {\n    DocumentView_Claims: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          Id\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n          ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n            edges {\n              node {\n                Id\n                LinkedEntityId {\n                  value\n                }\n                isFeedAttachment\n                ContentDocument {\n                  Id\n                  LastModifiedBy {\n                    ContactId {\n                      value\n                    }\n                  }\n                  Description {\n                    value\n                  }\n                  CreatedDate {\n                    value\n                  }\n                  LatestPublishedVersionId {\n                    value\n                  }\n                  FileExtension {\n                    value\n                  }\n                  Title {\n                    value\n                  }\n                  ContentSize {\n                    value\n                  }\n                  CreatedBy {\n                    Name {\n                      value\n                    }\n                    Username {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ForecastTableFragment on UIAPI {\n  query {\n    ForecastTable_ProfileForCostCategory: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ForecastDetails: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Profile Detail"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_LatestForecastCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_GolCosts: Acc_Profile__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Cost Category"}}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_CostCategoryGOLCost__c {\n            value\n          }\n          RecordType {\n            Name {\n              value\n            }\n          }\n        }\n      }\n    }\n    ForecastTable_AllClaimsForPartner: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Total Project Period"}}}, {Acc_ClaimStatus__c: {ne: "New "}}, {Acc_ClaimStatus__c: {ne: "Not used"}}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Id\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimDetails: Acc_Claims__c(where: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {RecordType: {Name: {eq: "Claims Detail"}}}, {Acc_ClaimStatus__c: {ne: "New"}}, {Acc_CostCategory__c: {ne: null}}]}, first: 2000, orderBy: {Acc_ProjectParticipant__r: {Acc_AccountId__r: {Name: {order: ASC}}}}) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_CostCategory__c {\n            value\n          }\n          Acc_ClaimStatus__c {\n            value\n          }\n          Acc_PeriodCostCategoryTotal__c {\n            value\n          }\n          Acc_ProjectPeriodEndDate__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n          Acc_ProjectPeriodStartDate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_ClaimsForIarDue: Acc_Claims__c(where: {and: [{Acc_ProjectID__c: {eq: $projectIdStr}}, {Acc_ProjectParticipant__c: {eq: $partnerId}}, {or: [{RecordType: {Name: {eq: "Total Project Period"}}}, {RecordType: {Name: {eq: "Claims Detail"}}}]}]}, first: 2000) {\n      edges {\n        node {\n          RecordType {\n            Name {\n              value\n            }\n          }\n          Acc_IAR_Status__c {\n            value\n          }\n          Acc_IARRequired__c {\n            value\n          }\n          Acc_ProjectPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_CostCategoryName__c {\n            value\n          }\n          Acc_DisplayOrder__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_CompetitionType__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Partner: Acc_ProjectParticipant__c(where: {and: [{Acc_ProjectId__c: {eq: $projectId}}, {Id: {eq: $partnerId}}]}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_AccountId__r {\n            Name {\n              value\n            }\n          }\n          Acc_ProjectRole__c {\n            value\n          }\n          Acc_OrganisationType__c {\n            value\n          }\n          Acc_ParticipantStatus__c {\n            value\n          }\n          Acc_OverheadRate__c {\n            value\n          }\n        }\n      }\n    }\n    ForecastTable_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          Acc_NumberofPeriods__c {\n            value\n          }\n          Acc_ClaimFrequency__c {\n            value\n          }\n          Acc_CurrentPeriodNumber__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment StatusChangesLogsFragment on UIAPI {\n  query {\n    StatusChanges_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          Acc_CompetitionType__c {\n            value\n          }\n          roles {\n            isFc\n            isPm\n            isMo\n          }\n        }\n      }\n    }\n    StatusChanges_StatusChanges: Acc_StatusChange__c(where: {Acc_Claim__r: {and: [{Acc_ProjectParticipant__c: {eq: $partnerId}}, {Acc_ProjectPeriodNumber__c: {eq: $periodId}}]}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n      edges {\n        node {\n          Id\n          Acc_NewClaimStatus__c {\n            value\n          }\n          Acc_ExternalComment__c {\n            value\n          }\n          Acc_ParticipantVisibility__c {\n            value\n          }\n          Acc_CreatedByAlias__c {\n            value\n          }\n          CreatedDate {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment TitleFragment on UIAPI {\n  query {\n    Title_Project: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = "04000e8f28794006cc78eff662e5051b";

export default node;
