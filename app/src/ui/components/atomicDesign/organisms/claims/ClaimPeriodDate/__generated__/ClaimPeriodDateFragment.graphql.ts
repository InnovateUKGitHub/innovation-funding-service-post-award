/**
 * @generated SignedSource<<1f82692541f8d0497135c0af4a0f85d6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClaimPeriodDateFragment$data = {
  readonly query: {
    readonly ClaimPeriodDate_Claims: {
      readonly edges: ReadonlyArray<{
        readonly node: {
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
    readonly ClaimPeriodDate_ProjectParticipant: {
      readonly edges: ReadonlyArray<{
        readonly node: {
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
  };
  readonly " $fragmentType": "ClaimPeriodDateFragment";
};
export type ClaimPeriodDateFragment$key = {
  readonly " $data"?: ClaimPeriodDateFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClaimPeriodDateFragment">;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "StringValue",
    "kind": "LinkedField",
    "name": "Name",
    "plural": false,
    "selections": (v3/*: any*/),
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
      "name": "periodId"
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
  "name": "ClaimPeriodDateFragment",
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
          "alias": "ClaimPeriodDate_Claims",
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
                      "fields": [
                        {
                          "fields": (v1/*: any*/),
                          "kind": "ObjectValue",
                          "name": "Acc_ProjectParticipant__c"
                        }
                      ],
                      "kind": "ObjectValue",
                      "name": "and.1"
                    },
                    {
                      "fields": [
                        {
                          "fields": [
                            {
                              "kind": "Variable",
                              "name": "eq",
                              "variableName": "periodId"
                            }
                          ],
                          "kind": "ObjectValue",
                          "name": "Acc_ProjectPeriodNumber__c"
                        }
                      ],
                      "kind": "ObjectValue",
                      "name": "and.2"
                    },
                    {
                      "kind": "Literal",
                      "name": "and.3",
                      "value": {
                        "RecordType": {
                          "Name": {
                            "eq": "Total Project Period"
                          }
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
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "RecordType",
                      "kind": "LinkedField",
                      "name": "RecordType",
                      "plural": false,
                      "selections": (v4/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DateValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodEndDate__c",
                      "plural": false,
                      "selections": (v3/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DateValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodStartDate__c",
                      "plural": false,
                      "selections": (v3/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DoubleValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectPeriodNumber__c",
                      "plural": false,
                      "selections": (v3/*: any*/),
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
          "alias": "ClaimPeriodDate_ProjectParticipant",
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
                              "variableName": "projectId"
                            }
                          ],
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
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Account",
                      "kind": "LinkedField",
                      "name": "Acc_AccountId__r",
                      "plural": false,
                      "selections": (v4/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectRole__c",
                      "plural": false,
                      "selections": (v3/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ParticipantStatus__c",
                      "plural": false,
                      "selections": (v3/*: any*/),
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

(node as any).hash = "61deaadf698fe0e4edd2d9c28b17a3b0";

export default node;
