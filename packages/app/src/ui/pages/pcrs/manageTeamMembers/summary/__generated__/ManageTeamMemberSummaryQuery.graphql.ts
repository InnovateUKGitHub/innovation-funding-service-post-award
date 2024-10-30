/**
 * @generated SignedSource<<dc06a1becd418d08356c12d6fdbd2b7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ManageTeamMemberSummaryQuery$variables = {
  pcrId: string;
  pcrItemId: string;
};
export type ManageTeamMemberSummaryQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Header: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Manage_Team_Member_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Project_Change_Requests__r: {
                readonly totalCount: number;
              } | null | undefined;
              readonly Acc_RequestNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Item: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Email__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_First_Name__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Last_Name__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectContactLink__r: {
                readonly Acc_ContactId__r: {
                  readonly FirstName: {
                    readonly value: string | null | undefined;
                  } | null | undefined;
                  readonly Id: string;
                  readonly LastName: {
                    readonly value: string | null | undefined;
                  } | null | undefined;
                  readonly Name: {
                    readonly value: string | null | undefined;
                  } | null | undefined;
                } | null | undefined;
                readonly Acc_EmailOfSFContact__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Acc_EndDate__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Acc_Role__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
                readonly Id: string;
              } | null | undefined;
              readonly Acc_Role__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Start_Date__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Type__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type ManageTeamMemberSummaryQuery = {
  response: ManageTeamMemberSummaryQuery$data;
  variables: ManageTeamMemberSummaryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pcrId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pcrItemId"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
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
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_Role__c",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
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
                "alias": "Header",
                "args": [
                  (v1/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "eq",
                            "variableName": "pcrId"
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
                "concreteType": "Acc_ProjectChangeRequest__cConnection",
                "kind": "LinkedField",
                "name": "Acc_ProjectChangeRequest__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_ProjectChangeRequest__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_ProjectChangeRequest__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_RequestNumber__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_ProjectChangeRequest__cConnection",
                            "kind": "LinkedField",
                            "name": "Acc_Project_Change_Requests__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "totalCount",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Manage_Team_Member_Status__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Status__c",
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
              },
              {
                "alias": "Item",
                "args": [
                  (v1/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "eq",
                            "variableName": "pcrItemId"
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
                "concreteType": "Acc_ProjectChangeRequest__cConnection",
                "kind": "LinkedField",
                "name": "Acc_ProjectChangeRequest__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_ProjectChangeRequest__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_ProjectChangeRequest__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Type__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_Start_Date__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "EmailValue",
                            "kind": "LinkedField",
                            "name": "Acc_Email__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_First_Name__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_Last_Name__c",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Acc_ProjectContactLink__c",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectContactLink__r",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Contact",
                                "kind": "LinkedField",
                                "name": "Acc_ContactId__r",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "StringValue",
                                    "kind": "LinkedField",
                                    "name": "Name",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "StringValue",
                                    "kind": "LinkedField",
                                    "name": "FirstName",
                                    "plural": false,
                                    "selections": (v2/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "StringValue",
                                    "kind": "LinkedField",
                                    "name": "LastName",
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
                                "concreteType": "DateValue",
                                "kind": "LinkedField",
                                "name": "Acc_EndDate__c",
                                "plural": false,
                                "selections": (v2/*: any*/),
                                "storageKey": null
                              },
                              (v3/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "EmailValue",
                                "kind": "LinkedField",
                                "name": "Acc_EmailOfSFContact__c",
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
    "name": "ManageTeamMemberSummaryQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ManageTeamMemberSummaryQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "df04cf55c11c41d649bcae4164a3e8f9",
    "id": null,
    "metadata": {},
    "name": "ManageTeamMemberSummaryQuery",
    "operationKind": "query",
    "text": "query ManageTeamMemberSummaryQuery(\n  $pcrId: ID!\n  $pcrItemId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Header: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrId}}, first: 1) {\n          edges {\n            node {\n              Acc_RequestNumber__c {\n                value\n              }\n              Acc_Project_Change_Requests__r {\n                totalCount\n              }\n              Acc_Manage_Team_Member_Status__c {\n                value\n              }\n              Acc_Status__c {\n                value\n              }\n            }\n          }\n        }\n        Item: Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrItemId}}, first: 1) {\n          edges {\n            node {\n              Acc_Type__c {\n                value\n              }\n              Acc_Start_Date__c {\n                value\n              }\n              Acc_Role__c {\n                value\n              }\n              Acc_Email__c {\n                value\n              }\n              Acc_First_Name__c {\n                value\n              }\n              Acc_Last_Name__c {\n                value\n              }\n              Acc_ProjectContactLink__r {\n                Id\n                Acc_ContactId__r {\n                  Id\n                  Name {\n                    value\n                  }\n                  FirstName {\n                    value\n                  }\n                  LastName {\n                    value\n                  }\n                }\n                Acc_EndDate__c {\n                  value\n                }\n                Acc_Role__c {\n                  value\n                }\n                Acc_EmailOfSFContact__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3053aa93b8b6d692498c1de508a5c1d8";

export default node;
