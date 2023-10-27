/**
 * @generated SignedSource<<20a836ab0ca4f29f50610de9ff67a800>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TotalCostsClaimedFragment$data = {
  readonly query: {
    readonly TotalCostsClaimed_ClaimDetails: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategory__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_PeriodCostCategoryTotal__c: {
            readonly value: number | null;
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
    readonly TotalCostsClaimed_ClaimOverrides: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategoryGOLCost__c: {
            readonly value: number | null;
          } | null;
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
    readonly TotalCostsClaimed_CostCategory: {
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
          readonly Acc_OverrideAwardRate__c: {
            readonly value: number | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
    readonly TotalCostsClaimed_Partner: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_Award_Rate__c: {
            readonly value: number | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
    readonly TotalCostsClaimed_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_NonFEC__c: {
            readonly value: boolean | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
  };
  readonly " $fragmentType": "TotalCostsClaimedFragment";
};
export type TotalCostsClaimedFragment$key = {
  readonly " $data"?: TotalCostsClaimedFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TotalCostsClaimedFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v1 = {
  "order": "ASC"
},
v2 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "partnerId"
  }
],
v3 = {
  "fields": [
    {
      "fields": (v2/*: any*/),
      "kind": "ObjectValue",
      "name": "Acc_ProjectParticipant__c"
    }
  ],
  "kind": "ObjectValue",
  "name": "and.0"
},
v4 = {
  "Acc_CostCategory__c": {
    "ne": null
  }
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v7 = {
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
      "selections": (v6/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_OverrideAwardRate__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v12 = [
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
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "TotalCostsClaimedFragment",
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
          "alias": "TotalCostsClaimed_ClaimDetails",
          "args": [
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "orderBy",
              "value": {
                "Acc_CostCategory__c": (v1/*: any*/),
                "Acc_ProjectPeriodNumber__c": (v1/*: any*/)
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
                          "DeveloperName": {
                            "eq": "Claims_Detail"
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
                    (v5/*: any*/),
                    (v7/*: any*/),
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_PeriodCostCategoryTotal__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
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
          "alias": "TotalCostsClaimed_ClaimOverrides",
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
                    {
                      "kind": "Literal",
                      "name": "and.2",
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
                    (v5/*: any*/),
                    (v7/*: any*/),
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Acc_CostCategory__c",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__r",
                      "plural": false,
                      "selections": [
                        (v10/*: any*/)
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategoryGOLCost__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    (v11/*: any*/),
                    (v9/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProfileOverrideAwardRate__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
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
          "alias": "TotalCostsClaimed_CostCategory",
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
                    (v5/*: any*/),
                    (v10/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_DisplayOrder__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_OrganisationType__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    (v11/*: any*/)
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
          "alias": "TotalCostsClaimed_Partner",
          "args": [
            (v0/*: any*/),
            {
              "fields": [
                {
                  "items": [
                    {
                      "fields": [
                        {
                          "fields": (v12/*: any*/),
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
                          "fields": (v2/*: any*/),
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
                    (v5/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_Award_Rate__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
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
          "alias": "TotalCostsClaimed_Project",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 1
            },
            {
              "fields": [
                {
                  "fields": (v12/*: any*/),
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
                    (v5/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BooleanValue",
                      "kind": "LinkedField",
                      "name": "Acc_NonFEC__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
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

(node as any).hash = "f2d309f9db70df3330368c523f3939f9";

export default node;
