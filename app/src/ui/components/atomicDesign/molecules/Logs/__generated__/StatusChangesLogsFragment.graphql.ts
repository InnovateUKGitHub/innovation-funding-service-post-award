/**
 * @generated SignedSource<<5230c58e2e5010a7f796725d248035bb>>
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
    readonly StatusChanges_StatusChanges: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CreatedByAlias__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_ExternalComment__c: {
            readonly value: any | null;
          } | null;
          readonly Acc_NewClaimStatus__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_ParticipantVisibility__c: {
            readonly value: boolean | null;
          } | null;
          readonly CreatedDate: {
            readonly value: string | null;
          } | null;
          readonly Id: string;
        } | null;
      } | null> | null;
    } | null;
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
          "alias": "StatusChanges_StatusChanges",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 2000
            },
            {
              "kind": "Literal",
              "name": "orderBy",
              "value": {
                "CreatedDate": {
                  "order": "DESC"
                }
              }
            },
            {
              "fields": [
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
          "selections": [
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

(node as any).hash = "29ca05e682dbee3e04656b3dd44e6eca";

export default node;
