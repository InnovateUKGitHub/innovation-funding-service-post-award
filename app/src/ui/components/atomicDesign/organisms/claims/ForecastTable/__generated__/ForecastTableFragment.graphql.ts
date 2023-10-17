/**
 * @generated SignedSource<<dcedce59dd29cd8260c6daefbbe08ad6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ForecastTableFragment$data = {
  readonly query: {
    readonly ForecastTable_AllClaimsForPartner: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ClaimStatus__c: {
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
    readonly ForecastTable_ClaimDetails: {
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
    readonly ForecastTable_ClaimsForIarDue: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_IARRequired__c: {
            readonly value: boolean | null;
          } | null;
          readonly Acc_IAR_Status__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null;
          } | null;
          readonly RecordType: {
            readonly DeveloperName: {
              readonly value: string | null;
            } | null;
          } | null;
        } | null;
      } | null> | null;
    } | null;
    readonly ForecastTable_CostCategory: {
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
    readonly ForecastTable_ForecastDetails: {
      readonly edges: ReadonlyArray<{
        readonly node: {
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
    readonly ForecastTable_GolCosts: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategoryGOLCost__c: {
            readonly value: number | null;
          } | null;
          readonly Acc_CostCategory__c: {
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
    readonly ForecastTable_Partner: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_AccountId__r: {
            readonly Name: {
              readonly value: string | null;
            } | null;
          } | null;
          readonly Acc_OrganisationType__c: {
            readonly value: string | null;
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
    readonly ForecastTable_ProfileForCostCategory: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategory__c: {
            readonly value: string | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
    readonly ForecastTable_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ClaimFrequency__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_CompetitionType__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_CurrentPeriodNumber__c: {
            readonly value: number | null;
          } | null;
          readonly Acc_NumberofPeriods__c: {
            readonly value: number | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
  };
  readonly " $fragmentType": "ForecastTableFragment";
};
export type ForecastTableFragment$key = {
  readonly " $data"?: ForecastTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ForecastTableFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v1 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v2 = [
  {
    "fields": (v1/*: any*/),
    "kind": "ObjectValue",
    "name": "Acc_ProjectParticipant__c"
  }
],
v3 = {
  "fields": (v2/*: any*/),
  "kind": "ObjectValue",
  "name": "and.0"
},
v4 = {
  "Acc_CostCategory__c": {
    "ne": null
  }
},
v5 = {
  "kind": "Literal",
  "name": "and.2",
  "value": (v4/*: any*/)
},
v6 = [
  (v0/*: any*/),
  {
    "fields": [
      {
        "items": [
          (v3/*: any*/),
          {
            "kind": "Literal",
            "name": "and.1",
            "value": {
              "RecordType": {
                "DeveloperName": {
                  "eq": "Profile_Detail"
                }
              }
            }
          },
          (v5/*: any*/)
        ],
        "kind": "ListValue",
        "name": "and"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "RecordType",
  "kind": "LinkedField",
  "name": "RecordType",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StringValue",
      "kind": "LinkedField",
      "name": "DeveloperName",
      "plural": false,
      "selections": (v8/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "RecordType": {
    "DeveloperName": {
      "eq": "Total_Project_Period"
    }
  }
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_ClaimStatus__c",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v16 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "partnerId"
    },
    {
      "kind": "RootArgument",
      "name": "projectId"
    },
    {
      "kind": "RootArgument",
      "name": "projectIdStr"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ForecastTableFragment",
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
          "alias": "ForecastTable_ProfileForCostCategory",
          "args": (v6/*: any*/),
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
                    (v7/*: any*/),
                    (v9/*: any*/)
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
          "alias": "ForecastTable_ForecastDetails",
          "args": (v6/*: any*/),
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
                    (v7/*: any*/),
                    (v9/*: any*/),
                    (v10/*: any*/),
                    (v11/*: any*/),
                    (v12/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_LatestForecastCost__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    (v13/*: any*/)
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
          "alias": "ForecastTable_GolCosts",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "items": [
                    (v3/*: any*/),
                    {
                      "kind": "Literal",
                      "name": "and.1",
                      "value": {
                        "RecordType": {
                          "DeveloperName": {
                            "eq": "Total_Cost_Category"
                          }
                        }
                      }
                    },
                    (v5/*: any*/)
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
                    (v7/*: any*/),
                    (v9/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategoryGOLCost__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    (v13/*: any*/)
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
          "alias": "ForecastTable_AllClaimsForPartner",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "items": [
                    (v3/*: any*/),
                    {
                      "kind": "Literal",
                      "name": "and.1",
                      "value": (v14/*: any*/)
                    },
                    {
                      "kind": "Literal",
                      "name": "and.2",
                      "value": {
                        "Acc_ClaimStatus__c": {
                          "ne": "New "
                        }
                      }
                    },
                    {
                      "kind": "Literal",
                      "name": "and.3",
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
                    (v13/*: any*/),
                    (v7/*: any*/),
                    (v15/*: any*/),
                    (v10/*: any*/)
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
          "alias": "ForecastTable_ClaimDetails",
          "args": [
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "orderBy",
              "value": {
                "Acc_ProjectParticipant__r": {
                  "Acc_AccountId__r": {
                    "Name": {
                      "order": "ASC"
                    }
                  }
                }
              }
            },
            {
              "fields": [
                {
                  "items": [
                    (v3/*: any*/),
                    {
                      "kind": "Literal",
                      "name": "and.1",
                      "value": {
                        "RecordType": {
                          "Name": {
                            "eq": "Claims Detail"
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
                      "value": (v4/*: any*/)
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
                    (v13/*: any*/),
                    (v9/*: any*/),
                    (v15/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_PeriodCostCategoryTotal__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    (v12/*: any*/),
                    (v10/*: any*/),
                    (v11/*: any*/)
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
          "alias": "ForecastTable_ClaimsForIarDue",
          "args": [
            (v0/*: any*/),
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
                      "fields": (v2/*: any*/),
                      "kind": "ObjectValue",
                      "name": "and.1"
                    },
                    {
                      "kind": "Literal",
                      "name": "and.2",
                      "value": {
                        "or": [
                          (v14/*: any*/),
                          {
                            "RecordType": {
                              "DeveloperName": {
                                "eq": "Claims_Detail"
                              }
                            }
                          }
                        ]
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
                    (v13/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_IAR_Status__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BooleanValue",
                      "kind": "LinkedField",
                      "name": "Acc_IARRequired__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    (v10/*: any*/)
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
          "alias": "ForecastTable_CostCategory",
          "args": [
            (v0/*: any*/)
          ],
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
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategoryName__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_DisplayOrder__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_OrganisationType__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    }
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
          "alias": "ForecastTable_Partner",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "items": [
                    {
                      "fields": [
                        {
                          "fields": (v16/*: any*/),
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
                          "fields": (v1/*: any*/),
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
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Account",
                      "kind": "LinkedField",
                      "name": "Acc_AccountId__r",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "StringValue",
                          "kind": "LinkedField",
                          "name": "Name",
                          "plural": false,
                          "selections": (v8/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectRole__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_OrganisationType__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ParticipantStatus__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_OverheadRate__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
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
          "alias": "ForecastTable_Project",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 1
            },
            {
              "fields": [
                {
                  "fields": (v16/*: any*/),
                  "kind": "ObjectValue",
                  "name": "Id"
                }
              ],
              "kind": "ObjectValue",
              "name": "where"
            }
          ],
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
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_NumberofPeriods__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ClaimFrequency__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_CurrentPeriodNumber__c",
                      "plural": false,
                      "selections": (v8/*: any*/),
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
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "b5f0ccc3ec68c4038c7a8e851db2553d";

export default node;
