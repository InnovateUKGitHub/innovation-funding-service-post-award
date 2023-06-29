/**
 * @generated SignedSource<<b61fc33c7d9a8665400c5c7c4030c6c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserSwitcherProjectQuery$variables = {
  projectId?: string | null;
};
export type UserSwitcherProjectQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Project_Contact_Links__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_ContactId__r: {
                      readonly Id: string;
                      readonly Name: {
                        readonly value: string | null;
                      } | null;
                      readonly username: string | null;
                    } | null;
                    readonly Acc_Role__c: {
                      readonly value: string | null;
                    } | null;
                    readonly Acc_UserId__r: {
                      readonly Name: {
                        readonly value: string | null;
                      } | null;
                      readonly Username: {
                        readonly value: string | null;
                      } | null;
                    } | null;
                  } | null;
                } | null> | null;
              } | null;
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type UserSwitcherProjectQuery = {
  response: UserSwitcherProjectQuery$data;
  variables: UserSwitcherProjectQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "projectId"
  }
],
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
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v1/*: any*/),
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "login",
        "value": "system"
      }
    ],
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v1/*: any*/),
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
                                  "Acc_ContactId__r": {
                                    "Name": {
                                      "order": "ASC"
                                    }
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
                                            "kind": "ScalarField",
                                            "name": "Id",
                                            "storageKey": null
                                          },
                                          (v2/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "username",
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "Acc_UserId__r",
                                        "plural": false,
                                        "selections": [
                                          (v2/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Username",
                                            "plural": false,
                                            "selections": (v1/*: any*/),
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
                                        "name": "Acc_Role__c",
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
                            "storageKey": "Project_Contact_Links__r(first:2000,orderBy:{\"Acc_ContactId__r\":{\"Name\":{\"order\":\"ASC\"}}})"
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
    "storageKey": "salesforce(login:\"system\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserSwitcherProjectQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserSwitcherProjectQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "d763ec8249a2a2df616519efe50c2ce3",
    "id": null,
    "metadata": {},
    "name": "UserSwitcherProjectQuery",
    "operationKind": "query",
    "text": "query UserSwitcherProjectQuery(\n  $projectId: ID\n) {\n  salesforce(login: \"system\") {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Acc_ProjectTitle__c {\n                value\n              }\n              Project_Contact_Links__r(orderBy: {Acc_ContactId__r: {Name: {order: ASC}}}, first: 2000) {\n                edges {\n                  node {\n                    Acc_ContactId__r {\n                      Id\n                      Name {\n                        value\n                      }\n                      username\n                    }\n                    Acc_UserId__r {\n                      Name {\n                        value\n                      }\n                      Username {\n                        value\n                      }\n                    }\n                    Acc_Role__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e8203377047071afebc623c59389fb0c";

export default node;
