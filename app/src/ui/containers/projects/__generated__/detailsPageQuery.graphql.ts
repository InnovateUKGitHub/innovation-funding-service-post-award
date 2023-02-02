/**
 * @generated SignedSource<<40cbb2f8000dd71d8f61e5e3eb54ade5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type detailsPageQuery$variables = {
  projectId?: string | null;
};
export type detailsPageQuery$data = {
  readonly uiapi: {
    readonly query: {
      readonly Acc_Project__c: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly Acc_CompetitionId__r: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Name: {
                readonly value: string | null;
              } | null;
            } | null;
            readonly Acc_CurrentPeriodNumber__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_Duration__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_EndDate__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_NumberofPeriods__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_ProjectNumber__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_ProjectParticipantsProject__r: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly Acc_ParticipantStatus__c: {
                    readonly value: string | null;
                  } | null;
                  readonly Acc_ParticipantType__c: {
                    readonly value: string | null;
                  } | null;
                  readonly Name: {
                    readonly value: string | null;
                  } | null;
                } | null;
              } | null> | null;
            } | null;
            readonly Acc_ProjectSummary__c: {
              readonly value: any | null;
            } | null;
            readonly Acc_ProjectTitle__c: {
              readonly value: string | null;
            } | null;
            readonly Acc_StartDate__c: {
              readonly value: string | null;
            } | null;
            readonly Project_Contact_Links__r: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly Acc_ContactId__r: {
                    readonly Account: {
                      readonly Name: {
                        readonly value: string | null;
                      } | null;
                    } | null;
                    readonly Name: {
                      readonly value: string | null;
                    } | null;
                  } | null;
                  readonly Acc_EmailOfSFContact__c: {
                    readonly value: string | null;
                  } | null;
                  readonly Acc_Role__c: {
                    readonly value: string | null;
                  } | null;
                } | null;
              } | null> | null;
            } | null;
            readonly roles: {
              readonly isFc: boolean;
              readonly isMo: boolean;
              readonly isPm: boolean;
            };
          } | null;
        } | null> | null;
      } | null;
    };
  };
};
export type detailsPageQuery = {
  response: detailsPageQuery$data;
  variables: detailsPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
v1 = {
  "Name": {
    "order": "ASC"
  }
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v4 = [
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
            "alias": null,
            "args": [
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
                        "concreteType": "Ext_Project_Roles",
                        "kind": "LinkedField",
                        "name": "roles",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isMo",
                            "storageKey": null
                          },
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
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "orderBy",
                            "value": {
                              "Acc_AccountId__r": (v1/*: any*/)
                            }
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
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "PicklistValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_ParticipantType__c",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "PicklistValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_ParticipantStatus__c",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "Acc_ProjectParticipantsProject__r(orderBy:{\"Acc_AccountId__r\":{\"Name\":{\"order\":\"ASC\"}}})"
                      },
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "orderBy",
                            "value": (v1/*: any*/)
                          }
                        ],
                        "concreteType": "Acc_ProjectContactLink__cConnection",
                        "kind": "LinkedField",
                        "name": "Project_Contact_Links__r",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_ProjectContactLink__cEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Acc_ProjectContactLink__c",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "EmailValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_EmailOfSFContact__c",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "PicklistValue",
                                    "kind": "LinkedField",
                                    "name": "Acc_Role__c",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Contact",
                                    "kind": "LinkedField",
                                    "name": "Acc_ContactId__r",
                                    "plural": false,
                                    "selections": [
                                      (v3/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Account",
                                        "kind": "LinkedField",
                                        "name": "Account",
                                        "plural": false,
                                        "selections": [
                                          (v3/*: any*/)
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
                        "storageKey": "Project_Contact_Links__r(orderBy:{\"Name\":{\"order\":\"ASC\"}})"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Competition__c",
                        "kind": "LinkedField",
                        "name": "Acc_CompetitionId__r",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
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
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StringValue",
                        "kind": "LinkedField",
                        "name": "Acc_ProjectTitle__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "kind": "LinkedField",
                        "name": "Acc_StartDate__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "kind": "LinkedField",
                        "name": "Acc_EndDate__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DoubleValue",
                        "kind": "LinkedField",
                        "name": "Acc_Duration__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DoubleValue",
                        "kind": "LinkedField",
                        "name": "Acc_CurrentPeriodNumber__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "DoubleValue",
                        "kind": "LinkedField",
                        "name": "Acc_NumberofPeriods__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "LongTextAreaValue",
                        "kind": "LinkedField",
                        "name": "Acc_ProjectSummary__c",
                        "plural": false,
                        "selections": (v2/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "detailsPageQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "detailsPageQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "e2e1d7858b163bf9e4762f8df3453260",
    "id": null,
    "metadata": {},
    "name": "detailsPageQuery",
    "operationKind": "query",
    "text": "query detailsPageQuery(\n  $projectId: ID\n) {\n  uiapi {\n    query {\n      Acc_Project__c(where: {Id: {eq: $projectId}}) {\n        edges {\n          node {\n            roles {\n              isMo\n              isFc\n              isPm\n            }\n            Acc_ProjectParticipantsProject__r(orderBy: {Acc_AccountId__r: {Name: {order: ASC}}}) {\n              edges {\n                node {\n                  Name {\n                    value\n                  }\n                  Acc_ParticipantType__c {\n                    value\n                  }\n                  Acc_ParticipantStatus__c {\n                    value\n                  }\n                }\n              }\n            }\n            Project_Contact_Links__r(orderBy: {Name: {order: ASC}}) {\n              edges {\n                node {\n                  Acc_EmailOfSFContact__c {\n                    value\n                  }\n                  Acc_Role__c {\n                    value\n                  }\n                  Acc_ContactId__r {\n                    Name {\n                      value\n                    }\n                    Account {\n                      Name {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            Acc_CompetitionId__r {\n              Name {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n            Acc_ProjectNumber__c {\n              value\n            }\n            Acc_ProjectTitle__c {\n              value\n            }\n            Acc_StartDate__c {\n              value\n            }\n            Acc_EndDate__c {\n              value\n            }\n            Acc_Duration__c {\n              value\n            }\n            Acc_CurrentPeriodNumber__c {\n              value\n            }\n            Acc_NumberofPeriods__c {\n              value\n            }\n            Acc_ProjectSummary__c {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d95a8c76959b651894a0eb0a64fa615f";

export default node;
