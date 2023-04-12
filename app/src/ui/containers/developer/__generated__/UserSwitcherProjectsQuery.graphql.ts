/**
 * @generated SignedSource<<968ddfafb09b918a79b6e7131224bf23>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserSwitcherProjectsQuery$variables = {
  search?: string | null;
};
export type UserSwitcherProjectsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionId__r: {
                readonly Acc_CompetitionType__c: {
                  readonly displayValue: string | null;
                } | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
            } | null;
          } | null> | null;
          readonly totalCount: number;
        } | null;
      };
    };
  };
};
export type UserSwitcherProjectsQuery = {
  response: UserSwitcherProjectsQuery$data;
  variables: UserSwitcherProjectsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
  }
],
v1 = {
  "order": "ASC"
},
v2 = [
  {
    "kind": "Variable",
    "name": "like",
    "variableName": "search"
  }
],
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v4 = [
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
                    "kind": "Literal",
                    "name": "first",
                    "value": 2000
                  },
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_CompetitionId__r": {
                        "Acc_CompetitionType__c": (v1/*: any*/)
                      },
                      "Acc_ProjectNumber__c": (v1/*: any*/)
                    }
                  },
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "fields": (v2/*: any*/),
                            "kind": "ObjectValue",
                            "name": "Acc_CompetitionType__c"
                          },
                          {
                            "fields": (v2/*: any*/),
                            "kind": "ObjectValue",
                            "name": "Acc_LeadParticipantName__c"
                          },
                          {
                            "fields": (v2/*: any*/),
                            "kind": "ObjectValue",
                            "name": "Acc_ProjectNumber__c"
                          },
                          {
                            "fields": (v2/*: any*/),
                            "kind": "ObjectValue",
                            "name": "Acc_ProjectTitle__c"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "or"
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
                    "kind": "ScalarField",
                    "name": "totalCount",
                    "storageKey": null
                  },
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
                            "kind": "ScalarField",
                            "name": "Id",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Competition__c",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionId__r",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_CompetitionType__c",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "displayValue",
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
    "name": "UserSwitcherProjectsQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserSwitcherProjectsQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "edc7f193fa09fcc102815459e7a37d0b",
    "id": null,
    "metadata": {},
    "name": "UserSwitcherProjectsQuery",
    "operationKind": "query",
    "text": "query UserSwitcherProjectsQuery(\n  $search: String\n) {\n  salesforce(login: \"system\") {\n    uiapi {\n      query {\n        Acc_Project__c(orderBy: {Acc_CompetitionId__r: {Acc_CompetitionType__c: {order: ASC}}, Acc_ProjectNumber__c: {order: ASC}}, where: {or: {Acc_ProjectTitle__c: {like: $search}, Acc_ProjectNumber__c: {like: $search}, Acc_LeadParticipantName__c: {like: $search}, Acc_CompetitionType__c: {like: $search}}}, first: 2000) {\n          totalCount\n          edges {\n            node {\n              Id\n              Acc_CompetitionId__r {\n                Acc_CompetitionType__c {\n                  displayValue\n                }\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "97eacbd3dd737895c3a787eeeabcc965";

export default node;
