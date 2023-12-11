/**
 * @generated SignedSource<<aa4b74090d316b8807bdc1a59fdf7bfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NewForecastTableFragment$data = {
  readonly query: {
    readonly ForecastTable_ClaimDetails: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategory__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_PeriodCostCategoryTotal__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_ClaimTotalProjectPeriods: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ClaimStatus__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_FinalClaim__c: {
            readonly value: boolean | null | undefined;
          } | null | undefined;
          readonly Acc_IARRequired__c: {
            readonly value: boolean | null | undefined;
          } | null | undefined;
          readonly Acc_IAR_Status__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodEndDate__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodStartDate__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_ProfileDetails: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategory__r: {
            readonly Id: string;
          } | null | undefined;
          readonly Acc_InitialForecastCost__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_LatestForecastCost__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Id: string;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_ProfileTotalCostCategories: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategoryGOLCost__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_CostCategory__r: {
            readonly Acc_CostCategoryName__c: {
              readonly value: string | null | undefined;
            } | null | undefined;
            readonly Id: string;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_ProfileTotalProjectPeriod: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ProjectPeriodEndDate__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodStartDate__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_NumberofPeriods__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly roles: {
            readonly isFc: boolean;
            readonly isMo: boolean;
            readonly isPm: boolean;
          };
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ForecastTable_ProjectParticipant: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_ForecastLastModifiedDate__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_OverheadRate__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "NewForecastTableFragment";
};
export type NewForecastTableFragment$key = {
  readonly " $data"?: NewForecastTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewForecastTableFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectParticipantId"
  }
],
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v4 = {
  "order": "ASC"
},
v5 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "Acc_ProjectPeriodNumber__c": (v4/*: any*/)
  }
},
v6 = {
  "fields": (v2/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_ProjectParticipant__c"
},
v7 = {
  "fields": [
    (v6/*: any*/),
    {
      "kind": "Literal",
      "name": "RecordType",
      "value": {
        "DeveloperName": {
          "eq": "Total_Project_Period"
        }
      }
    }
  ],
  "kind": "ObjectValue",
  "name": "where"
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v1/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodStartDate__c",
  "plural": false,
  "selections": (v1/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodEndDate__c",
  "plural": false,
  "selections": (v1/*: any*/),
  "storageKey": null
},
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "projectId"
    },
    {
      "kind": "RootArgument",
      "name": "projectParticipantId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "NewForecastTableFragment",
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
          "alias": "ForecastTable_Project",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "fields": [
                    {
                      "kind": "Variable",
                      "name": "eq",
                      "variableName": "projectId"
                    }
                  ],
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_NumberofPeriods__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
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
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "isFc",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "isPm",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "isMo",
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
        },
        {
          "alias": "ForecastTable_ProjectParticipant",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "fields": (v2/*: any*/),
                  "kind": "ObjectValue",
                  "name": "Id"
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DateTimeValue",
                      "kind": "LinkedField",
                      "name": "Acc_ForecastLastModifiedDate__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_OverheadRate__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
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
          "alias": "ForecastTable_ClaimTotalProjectPeriods",
          "args": [
            (v3/*: any*/),
            (v5/*: any*/),
            (v7/*: any*/)
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
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_IAR_Status__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BooleanValue",
                      "kind": "LinkedField",
                      "name": "Acc_IARRequired__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ClaimStatus__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    (v9/*: any*/),
                    (v10/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BooleanValue",
                      "kind": "LinkedField",
                      "name": "Acc_FinalClaim__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
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
          "alias": "ForecastTable_ClaimDetails",
          "args": [
            (v11/*: any*/),
            (v5/*: any*/),
            {
              "fields": [
                (v6/*: any*/),
                {
                  "kind": "Literal",
                  "name": "RecordType",
                  "value": {
                    "DeveloperName": {
                      "eq": "Claims_Detail"
                    }
                  }
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
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_PeriodCostCategoryTotal__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "IDValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
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
          "alias": "ForecastTable_ProfileTotalProjectPeriod",
          "args": [
            (v3/*: any*/),
            (v7/*: any*/)
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
                    (v8/*: any*/),
                    (v9/*: any*/),
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
          "alias": "ForecastTable_ProfileTotalCostCategories",
          "args": [
            (v3/*: any*/),
            {
              "kind": "Literal",
              "name": "orderBy",
              "value": {
                "Acc_CostCategory__r": {
                  "Acc_DisplayOrder__c": (v4/*: any*/)
                }
              }
            },
            {
              "fields": [
                (v6/*: any*/),
                {
                  "kind": "Literal",
                  "name": "RecordType",
                  "value": {
                    "DeveloperName": {
                      "eq": "Total_Cost_Category"
                    }
                  }
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategoryGOLCost__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Acc_CostCategory__c",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__r",
                      "plural": false,
                      "selections": [
                        (v12/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "StringValue",
                          "kind": "LinkedField",
                          "name": "Acc_CostCategoryName__c",
                          "plural": false,
                          "selections": (v1/*: any*/),
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
        },
        {
          "alias": "ForecastTable_ProfileDetails",
          "args": [
            (v11/*: any*/),
            (v5/*: any*/),
            {
              "fields": [
                (v6/*: any*/),
                {
                  "kind": "Literal",
                  "name": "RecordType",
                  "value": {
                    "DeveloperName": {
                      "eq": "Profile_Detail"
                    }
                  }
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_InitialForecastCost__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_LatestForecastCost__c",
                      "plural": false,
                      "selections": (v1/*: any*/),
                      "storageKey": null
                    },
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Acc_CostCategory__c",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__r",
                      "plural": false,
                      "selections": [
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
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "050bab9ef5c5dcf9d72db41af6f31b6d";

export default node;
