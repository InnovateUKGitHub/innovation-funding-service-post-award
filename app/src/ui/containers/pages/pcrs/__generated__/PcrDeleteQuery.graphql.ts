/**
 * @generated SignedSource<<3f4773c8b5068bcf385cef095fb31d36>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PcrDeleteQuery$variables = {
  pcrId: string;
  projectId: string;
};
export type PcrDeleteQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Project_Change_Requests__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_RequestHeader__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_RequestNumber__c: {
                      readonly value: number | null | undefined;
                    } | null | undefined;
                    readonly CreatedDate: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                    readonly LastModifiedDate: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly RecordType: {
                      readonly DeveloperName: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Name: {
                        readonly label: string | null | undefined;
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type PcrDeleteQuery = {
  response: PcrDeleteQuery$data;
  variables: PcrDeleteQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrId"
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v4 = [
  (v3/*: any*/)
],
v5 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrId"
  }
],
v6 = [
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
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v4/*: any*/),
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
                                "fields": [
                                  {
                                    "items": [
                                      {
                                        "fields": [
                                          {
                                            "fields": (v5/*: any*/),
                                            "kind": "ObjectValue",
                                            "name": "Id"
                                          }
                                        ],
                                        "kind": "ObjectValue",
                                        "name": "or.0"
                                      },
                                      {
                                        "fields": [
                                          {
                                            "fields": (v5/*: any*/),
                                            "kind": "ObjectValue",
                                            "name": "Acc_RequestHeader__c"
                                          }
                                        ],
                                        "kind": "ObjectValue",
                                        "name": "or.1"
                                      }
                                    ],
                                    "kind": "ListValue",
                                    "name": "or"
                                  }
                                ],
                                "kind": "ObjectValue",
                                "name": "where"
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
                                      (v2/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_RequestHeader__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DoubleValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_RequestNumber__c",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "CreatedDate",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateTimeValue",
                                        "kind": "LinkedField",
                                        "name": "LastModifiedDate",
                                        "plural": false,
                                        "selections": (v4/*: any*/),
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
                                            "selections": [
                                              (v3/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "label",
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
                                            "name": "DeveloperName",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PcrDeleteQuery",
    "selections": (v6/*: any*/),
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
    "name": "PcrDeleteQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "c28dd58f417320c10f80d780b2cd54dc",
    "id": null,
    "metadata": {},
    "name": "PcrDeleteQuery",
    "operationKind": "query",
    "text": "query PcrDeleteQuery(\n  $projectId: ID!\n  $pcrId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Project_Change_Requests__r(first: 2000, where: {or: [{Id: {eq: $pcrId}}, {Acc_RequestHeader__c: {eq: $pcrId}}]}) {\n                edges {\n                  node {\n                    Id\n                    Acc_RequestHeader__c {\n                      value\n                    }\n                    Acc_RequestNumber__c {\n                      value\n                    }\n                    CreatedDate {\n                      value\n                    }\n                    LastModifiedDate {\n                      value\n                    }\n                    RecordType {\n                      Name {\n                        value\n                        label\n                      }\n                      DeveloperName {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a8199899033a7b2bdf2c6060f21f489c";

export default node;
