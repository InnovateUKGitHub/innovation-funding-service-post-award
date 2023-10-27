/**
 * @generated SignedSource<<c974b775cf5336e8d87e313f7e3bbb43>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StatusChangesLogsFragment$data = {
  readonly query: {
    readonly StatusChanges_Project: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CompetitionType__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Id: string;
          readonly roles: {
            readonly isFc: boolean;
            readonly isMo: boolean;
            readonly isPm: boolean;
          };
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly StatusChanges_StatusChanges?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CreatedByAlias__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ExternalComment__c: {
            readonly value: any | null | undefined;
          } | null | undefined;
          readonly Acc_NewClaimStatus__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ParticipantVisibility__c: {
            readonly value: boolean | null | undefined;
          } | null | undefined;
          readonly CreatedDate: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Id: string;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "StatusChangesLogsFragment";
};
export type StatusChangesLogsFragment$key = {
  readonly " $data"?: StatusChangesLogsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StatusChangesLogsFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
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
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v3 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "CreatedDate": {
      "order": "DESC"
    }
  }
},
v4 = [
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
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Acc_StatusChange__cEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Acc_StatusChange__c",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TextAreaValue",
            "kind": "LinkedField",
            "name": "Acc_NewClaimStatus__c",
            "plural": false,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "LongTextAreaValue",
            "kind": "LinkedField",
            "name": "Acc_ExternalComment__c",
            "plural": false,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "BooleanValue",
            "kind": "LinkedField",
            "name": "Acc_ParticipantVisibility__c",
            "plural": false,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "StringValue",
            "kind": "LinkedField",
            "name": "Acc_CreatedByAlias__c",
            "plural": false,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DateTimeValue",
            "kind": "LinkedField",
            "name": "CreatedDate",
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
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "allPeriods"
    },
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
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "StatusChangesLogsFragment",
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
          "alias": "StatusChanges_Project",
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
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
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
          "condition": "allPeriods",
          "kind": "Condition",
          "passingValue": true,
          "selections": [
            {
              "alias": "StatusChanges_StatusChanges",
              "args": [
                (v2/*: any*/),
                (v3/*: any*/),
                {
                  "fields": [
                    {
                      "fields": (v4/*: any*/),
                      "kind": "ObjectValue",
                      "name": "Acc_Claim__r"
                    }
                  ],
                  "kind": "ObjectValue",
                  "name": "where"
                }
              ],
              "concreteType": "Acc_StatusChange__cConnection",
              "kind": "LinkedField",
              "name": "Acc_StatusChange__c",
              "plural": false,
              "selections": (v5/*: any*/),
              "storageKey": null
            }
          ]
        },
        {
          "condition": "allPeriods",
          "kind": "Condition",
          "passingValue": false,
          "selections": [
            {
              "alias": "StatusChanges_StatusChanges",
              "args": [
                (v2/*: any*/),
                (v3/*: any*/),
                {
                  "fields": [
                    {
                      "fields": [
                        {
                          "items": [
                            {
                              "fields": (v4/*: any*/),
                              "kind": "ObjectValue",
                              "name": "and.0"
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
                              "name": "and.1"
                            }
                          ],
                          "kind": "ListValue",
                          "name": "and"
                        }
                      ],
                      "kind": "ObjectValue",
                      "name": "Acc_Claim__r"
                    }
                  ],
                  "kind": "ObjectValue",
                  "name": "where"
                }
              ],
              "concreteType": "Acc_StatusChange__cConnection",
              "kind": "LinkedField",
              "name": "Acc_StatusChange__c",
              "plural": false,
              "selections": (v5/*: any*/),
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    }
  ],
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "be2588b8f4e6dc06f3c3209b117c2ea4";

export default node;
