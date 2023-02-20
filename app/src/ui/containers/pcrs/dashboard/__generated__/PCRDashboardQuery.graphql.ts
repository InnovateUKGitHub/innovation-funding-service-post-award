/**
 * @generated SignedSource<<78a731ef4864dc8f4857733fa3c47c95>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PCRDashboardQuery$variables = {
  projectId?: string | null;
};
export type PCRDashboardQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
              readonly Project_Change_Requests__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_RequestHeader__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_RequestNumber__c: {
                      readonly value: number | null;
                    } | null;
                    readonly Acc_Status__c: {
                      readonly value: string | null;
                    } | null;
                    readonly CreatedDate: {
                      readonly value: string | null;
                    } | null;
                    readonly Id: string;
                    readonly LastModifiedDate: {
                      readonly value: string | null;
                    } | null;
                    readonly RecordType: {
                      readonly Name: {
                        readonly value: string | null;
                      } | null;
                    } | null;
                  } | null;
                } | null> | null;
              } | null;
              readonly isActive: boolean;
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
};
export type PCRDashboardQuery = {
  response: PCRDashboardQuery$data;
  variables: PCRDashboardQuery$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
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
v3 = [
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
                          (v1/*: any*/),
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
                                  "Acc_RequestNumber__c": {
                                    "order": "DESC"
                                  }
                                }
                              }
                            ],
                            "concreteType": "Acc_ProjectChangeRequest__cConnection",
                            "kind": "LinkedField",
                            "name": "Project_Change_Requests__r",
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
                                      (v1/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Status__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_RequestHeader__c",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
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
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "CreatedDate",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "LastModifiedDate",
                                        "plural": false,
                                        "selections": (v2/*: any*/),
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
                                            "name": "Name",
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
                            "storageKey": "Project_Change_Requests__r(first:2000,orderBy:{\"Acc_RequestNumber__c\":{\"order\":\"DESC\"}})"
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
    "name": "PCRDashboardQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PCRDashboardQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "2282daf4001156ed27df446bd0da3605",
    "id": null,
    "metadata": {},
    "name": "PCRDashboardQuery",
    "operationKind": "query",
    "text": "query PCRDashboardQuery(\n  $projectId: ID\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Project_Change_Requests__r(first: 2000, orderBy: {Acc_RequestNumber__c: {order: DESC}}) {\n                edges {\n                  node {\n                    Id\n                    Acc_Status__c {\n                      value\n                    }\n                    Acc_RequestHeader__c {\n                      value\n                    }\n                    Acc_RequestNumber__c {\n                      value\n                    }\n                    CreatedDate {\n                      value\n                    }\n                    LastModifiedDate {\n                      value\n                    }\n                    RecordType {\n                      Name {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f9bf88da0901f459be62da30891c777e";

export default node;
