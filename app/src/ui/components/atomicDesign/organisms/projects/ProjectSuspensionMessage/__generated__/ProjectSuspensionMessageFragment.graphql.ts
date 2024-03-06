/**
 * @generated SignedSource<<032002452420d38bbb5d99db625ae6bd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectSuspensionMessageFragment$data = {
  readonly query: {
    readonly ProjectSuspensionProject: {
      readonly edges: ReadonlyArray<{
        readonly node: {
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
          readonly Id: string;
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
  readonly " $fragmentType": "ProjectSuspensionMessageFragment";
};
export type ProjectSuspensionMessageFragment$key = {
  readonly " $data"?: ProjectSuspensionMessageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectSuspensionMessageFragment">;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "projectId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectSuspensionMessageFragment",
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
          "alias": "ProjectSuspensionProject",
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
                      "concreteType": "PicklistValue",
                      "kind": "LinkedField",
                      "name": "Acc_ProjectStatus__c",
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
                        (v2/*: any*/),
                        (v3/*: any*/),
                        (v4/*: any*/),
                        (v5/*: any*/),
                        (v6/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Ext_Partner_Roles",
                          "kind": "LinkedField",
                          "name": "partnerRoles",
                          "plural": true,
                          "selections": [
                            (v3/*: any*/),
                            (v4/*: any*/),
                            (v2/*: any*/),
                            (v6/*: any*/),
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
                                  "selections": (v1/*: any*/),
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "BooleanValue",
                                  "kind": "LinkedField",
                                  "name": "Acc_FlaggedParticipant__c",
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

(node as any).hash = "c50a05bd984075e0919a1b42caf43dd8";

export default node;
