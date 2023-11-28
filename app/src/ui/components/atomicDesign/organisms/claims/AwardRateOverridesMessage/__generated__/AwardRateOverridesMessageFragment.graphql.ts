/**
 * @generated SignedSource<<afd2be3b6dec8b0ea8f3266d3f76c14d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AwardRateOverridesMessageFragment$data = {
  readonly query: {
    readonly AwardRateOverridesMessage_Profile: {
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
          readonly Acc_LatestForecastCost__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_OverrideAwardRate__c: {
            readonly value: number | null | undefined;
          } | null | undefined;
          readonly Acc_ProfileOverrideAwardRate__c: {
            readonly value: number | null | undefined;
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
          readonly Id: string;
          readonly RecordType: {
            readonly DeveloperName: {
              readonly value: string | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly AwardRateOverridesMessage_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_NonFEC__c: {
            readonly value: boolean | null | undefined;
          } | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "AwardRateOverridesMessageFragment";
};
export type AwardRateOverridesMessageFragment$key = {
  readonly " $data"?: AwardRateOverridesMessageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AwardRateOverridesMessageFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
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
  "name": "AwardRateOverridesMessageFragment",
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
          "alias": "AwardRateOverridesMessage_Project",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 1
            },
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
                      "concreteType": "BooleanValue",
                      "kind": "LinkedField",
                      "name": "Acc_NonFEC__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
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
          "alias": "AwardRateOverridesMessage_Profile",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 2000
            },
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
                    {
                      "kind": "Literal",
                      "name": "and.1",
                      "value": {
                        "or": [
                          {
                            "RecordType": {
                              "DeveloperName": {
                                "eq": "Total_Project_Period"
                              }
                            }
                          },
                          {
                            "RecordType": {
                              "DeveloperName": {
                                "eq": "Total_Cost_Category"
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
                      "kind": "ScalarField",
                      "name": "Id",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "IDValue",
                      "kind": "LinkedField",
                      "name": "Acc_CostCategory__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
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
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "StringValue",
                          "kind": "LinkedField",
                          "name": "Acc_CostCategoryName__c",
                          "plural": false,
                          "selections": (v0/*: any*/),
                          "storageKey": null
                        }
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
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_OverrideAwardRate__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodNumber__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PercentValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProfileOverrideAwardRate__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DateValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodStartDate__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DateValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodEndDate__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CurrencyValue",
                      "kind": "LinkedField",
                      "name": "Acc_LatestForecastCost__c",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
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
                          "selections": (v0/*: any*/),
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
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "28a9595bb28500fb44aec98b6e41c536";

export default node;
