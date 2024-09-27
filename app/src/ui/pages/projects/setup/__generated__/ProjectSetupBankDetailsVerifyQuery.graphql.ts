/**
 * @generated SignedSource<<b6ea38b6abbadeccc7666f350da3f8c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectSetupBankDetailsVerifyQuery$variables = {
  partnerId: string;
  projectId: string;
};
export type ProjectSetupBankDetailsVerifyQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectParticipant__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AccountId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_AccountNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AddressBuildingName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AddressLocality__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AddressPostcode__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AddressStreet__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_AddressTown__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_FirstName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_LastName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectId__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_RegistrationNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_SortCode__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"PageFragment">;
    };
  };
};
export type ProjectSetupBankDetailsVerifyQuery = {
  response: ProjectSetupBankDetailsVerifyQuery$data;
  variables: ProjectSetupBankDetailsVerifyQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
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
v4 = {
  "alias": null,
  "args": [
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
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectId__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
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
                  "selections": (v3/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "EncryptedStringValue",
              "kind": "LinkedField",
              "name": "Acc_AccountNumber__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_AddressBuildingName__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_AddressLocality__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_AddressPostcode__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_AddressStreet__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_AddressTown__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_RegistrationNumber__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_FirstName__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_LastName__c",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "EncryptedStringValue",
              "kind": "LinkedField",
              "name": "Acc_SortCode__c",
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectSetupBankDetailsVerifyQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SalesforceQuery",
        "kind": "LinkedField",
        "name": "salesforce",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UIAPI",
            "kind": "LinkedField",
            "name": "uiapi",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PageFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectSetupBankDetailsVerifyQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SalesforceQuery",
        "kind": "LinkedField",
        "name": "salesforce",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UIAPI",
            "kind": "LinkedField",
            "name": "uiapi",
            "plural": false,
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
                              (v2/*: any*/),
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
                                  (v5/*: any*/),
                                  (v6/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v9/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v5/*: any*/),
                                      (v6/*: any*/),
                                      (v7/*: any*/),
                                      (v8/*: any*/),
                                      (v9/*: any*/),
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
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectStatus__c",
                                "plural": false,
                                "selections": (v3/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "first",
                                    "value": 200
                                  }
                                ],
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
                                          (v2/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v3/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
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
                                "storageKey": "Acc_ProjectParticipantsProject__r(first:200)"
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
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a5882093d96c4a905f34cd174627fd65",
    "id": null,
    "metadata": {},
    "name": "ProjectSetupBankDetailsVerifyQuery",
    "operationKind": "query",
    "text": "query ProjectSetupBankDetailsVerifyQuery(\n  $projectId: ID!\n  $partnerId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...PageFragment\n      query {\n        Acc_ProjectParticipant__c(where: {Id: {eq: $partnerId}}) {\n          edges {\n            node {\n              Id\n              Acc_ProjectId__c {\n                value\n              }\n              Acc_AccountId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_AccountNumber__c {\n                value\n              }\n              Acc_AddressBuildingName__c {\n                value\n              }\n              Acc_AddressLocality__c {\n                value\n              }\n              Acc_AddressPostcode__c {\n                value\n              }\n              Acc_AddressStreet__c {\n                value\n              }\n              Acc_AddressTown__c {\n                value\n              }\n              Acc_RegistrationNumber__c {\n                value\n              }\n              Acc_FirstName__c {\n                value\n              }\n              Acc_LastName__c {\n                value\n              }\n              Acc_SortCode__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r(first: 200) {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "544685485d0b65ac631c9ade13069456";

export default node;
