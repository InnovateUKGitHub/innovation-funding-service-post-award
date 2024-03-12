/**
 * @generated SignedSource<<b14fcd82472f95a4102eb2a997c8fcc1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ContactSetupAssociateQuery$variables = {
  projectId: string;
};
export type ContactSetupAssociateQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Project_Contact_Links__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_ContactId__r: {
                      readonly Name: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly Acc_EmailOfSFContact__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Associate_Start_Date__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
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
export type ContactSetupAssociateQuery = {
  response: ContactSetupAssociateQuery$data;
  variables: ContactSetupAssociateQuery$variables;
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
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
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
                                "name": "where",
                                "value": {
                                  "Acc_Role__c": {
                                    "eq": "Associate"
                                  }
                                }
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
                                      (v1/*: any*/),
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
                                        "concreteType": "Contact",
                                        "kind": "LinkedField",
                                        "name": "Acc_ContactId__r",
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
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "DateValue",
                                        "kind": "LinkedField",
                                        "name": "Associate_Start_Date__c",
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
                            "storageKey": "Project_Contact_Links__r(first:2000,where:{\"Acc_Role__c\":{\"eq\":\"Associate\"}})"
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
    "name": "ContactSetupAssociateQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContactSetupAssociateQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "b843a571bae23f0b94dcc64cba414f22",
    "id": null,
    "metadata": {},
    "name": "ContactSetupAssociateQuery",
    "operationKind": "query",
    "text": "query ContactSetupAssociateQuery(\n  $projectId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Project_Contact_Links__r(where: {Acc_Role__c: {eq: \"Associate\"}}, first: 2000) {\n                edges {\n                  node {\n                    Id\n                    Acc_EmailOfSFContact__c {\n                      value\n                    }\n                    Acc_ContactId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Associate_Start_Date__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "669123fc676877aa9ba7f0b51124c8e2";

export default node;
