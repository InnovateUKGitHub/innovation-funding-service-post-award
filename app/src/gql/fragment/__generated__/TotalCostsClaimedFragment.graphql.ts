/**
 * @generated SignedSource<<d643396585a6ff1a418caad73d9bf358>>
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
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_PeriodCostCategoryTotal__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Id: string;
          readonly RecordType: {
            readonly DeveloperName: {
              readonly value: string | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly TotalCostsClaimed_ClaimOverrides: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CostCategoryGOLCost__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_CostCategory__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_CostCategory__r: {
            readonly Acc_CostCategoryName__c: {
              readonly value: string | null | undefined;
            } | null | undefined;
          } | null | undefined;
          readonly Acc_OverrideAwardRate__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProfileOverrideAwardRate__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectPeriodNumber__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Id: string;
          readonly RecordType: {
            readonly DeveloperName: {
              readonly value: string | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly TotalCostsClaimed_CostCategory: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CompetitionType__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_CostCategoryName__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_DisplayOrder__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_OrganisationType__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_OverrideAwardRate__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Id: string;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
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
v2 = {
  "fields": [
    {
      "fields": [
        {
          "kind": "Variable",
          "name": "eq",
          "variableName": "partnerId"
        }
      ],
      "kind": "ObjectValue",
      "name": "Acc_ProjectParticipant__c"
    }
  ],
  "kind": "ObjectValue",
  "name": "and.0"
},
v3 = {
  "Acc_CostCategory__c": {
    "ne": null
  }
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v6 = {
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
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategory__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectPeriodNumber__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CostCategoryName__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "PercentValue",
  "kind": "LinkedField",
  "name": "Acc_OverrideAwardRate__c",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "partnerId"
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
                    (v2/*: any*/),
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
                      "value": (v3/*: any*/)
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
                    (v4/*: any*/),
                    (v6/*: any*/),
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_PeriodCostCategoryTotal__c",
                      "plural": false,
                      "selections": (v5/*: any*/),
                      "storageKey": null
                    },
                    (v8/*: any*/)
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
                    (v2/*: any*/),
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
                      "value": (v3/*: any*/)
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
                    (v4/*: any*/),
                    (v6/*: any*/),
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Acc_CostCategory__c",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__r",
                      "plural": false,
                      "selections": [
                        (v9/*: any*/)
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
                      "selections": (v5/*: any*/),
                      "storageKey": null
                    },
                    (v10/*: any*/),
                    (v8/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProfileOverrideAwardRate__c",
                      "plural": false,
                      "selections": (v5/*: any*/),
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
                    (v4/*: any*/),
                    (v9/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_DisplayOrder__c",
                      "plural": false,
                      "selections": (v5/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_OrganisationType__c",
                      "plural": false,
                      "selections": (v5/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
                      "plural": false,
                      "selections": (v5/*: any*/),
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
          "storageKey": "Acc_CostCategory__c(first:2000)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "90658a191e28302b1e058fb19ecad2f5";

export default node;
