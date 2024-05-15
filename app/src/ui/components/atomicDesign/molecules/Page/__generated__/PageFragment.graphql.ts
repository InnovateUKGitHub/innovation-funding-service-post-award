/**
 * @generated SignedSource<<097dd5abe89dbd151d8bdc5e79b7dfa5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PageFragment$data = {
  readonly query: {
    readonly Page: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_CompetitionType__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_MonitoringLevel__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectNumber__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectParticipantsProject__r: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly Acc_FlaggedParticipant__c: {
                  readonly value: boolean | null | undefined;
                } | null | undefined;
                readonly Acc_ParticipantStatus__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
            } | null | undefined> | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectStatus__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Acc_ProjectTitle__c: {
            readonly value: string | null | undefined;
          } | null | undefined;
          readonly Id: string;
          readonly isActive: boolean;
          readonly roles: {
            readonly isAssociate: boolean;
            readonly isFc: boolean;
            readonly isMo: boolean;
            readonly isPm: boolean;
            readonly isSalesforceSystemUser: boolean;
            readonly partnerRoles: ReadonlyArray<{
              readonly isAssociate: boolean;
              readonly isFc: boolean;
              readonly isMo: boolean;
              readonly isPm: boolean;
              readonly isSalesforceSystemUser: boolean;
              readonly partnerId: string;
            }>;
          };
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "PageFragment";
};
export type PageFragment$key = {
  readonly " $data"?: PageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PageFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
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
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "projectId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "PageFragment",
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
          "alias": "Page",
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
                      "kind": "ScalarField",
                      "name": "isActive",
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
                        (v1/*: any*/),
                        (v2/*: any*/),
                        (v3/*: any*/),
                        (v4/*: any*/),
                        (v5/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Ext_Partner_Roles",
                          "kind": "LinkedField",
                          "name": "partnerRoles",
                          "plural": true,
                          "selections": [
                            (v1/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/),
                            (v4/*: any*/),
                            (v5/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "partnerId",
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectNumber__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectTitle__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectStatus__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_MonitoringLevel__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Acc_CompetitionType__c",
                      "plural": false,
                      "selections": (v6/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Acc_ProjectParticipant__cConnection",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectParticipantsProject__r",
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
                                (v0/*: any*/),
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "PicklistValue",
                                  "kind": "LinkedField",
                                  "name": "Acc_ParticipantStatus__c",
                                  "plural": false,
                                  "selections": (v6/*: any*/),
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "BooleanValue",
                                  "kind": "LinkedField",
                                  "name": "Acc_FlaggedParticipant__c",
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

(node as any).hash = "f6b1df4d4ec485c23c11323d0fe473db";

export default node;
