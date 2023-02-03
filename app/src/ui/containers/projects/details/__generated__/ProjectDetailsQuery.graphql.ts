/**
 * @generated SignedSource<<6e75087e6b976df0494496f7f21e1762>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDetailsQuery$variables = {
  projectId: string;
};
export type ProjectDetailsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_CurrentPeriodEndDate__c: {
                readonly displayValue: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: any | null;
              } | null;
              readonly Acc_CurrentPeriodStartDate__c: {
                readonly displayValue: string | null;
                readonly value: string | null;
              } | null;
              readonly Acc_NumberofPeriods__c: {
                readonly value: any | null;
              } | null;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null;
              } | null;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null;
              } | null;
              readonly Id: string;
              readonly " $fragmentSpreads": FragmentRefs<"ProjectDetailProjectContactLinkTableFragment" | "ProjectDetailProjectInformationTableFragment" | "ProjectDetailProjectParticipantsProjectTableFragment" | "ProjectStatusFragment">;
            } | null;
          } | null> | null;
        } | null;
      };
    };
  };
};
export type ProjectDetailsQuery = {
  response: ProjectDetailsQuery$data;
  variables: ProjectDetailsQuery$variables;
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
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectNumber__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_ProjectTitle__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_CurrentPeriodNumber__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_NumberofPeriods__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v9 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "displayValue",
    "storageKey": null
  }
],
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_CurrentPeriodStartDate__c",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "DateValue",
  "kind": "LinkedField",
  "name": "Acc_CurrentPeriodEndDate__c",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_CompetitionType__c",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v14 = [
  (v13/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectDetailsQuery",
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
                    "alias": null,
                    "args": (v1/*: any*/),
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
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "ProjectStatusFragment"
                              },
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "ProjectDetailProjectContactLinkTableFragment"
                              },
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "ProjectDetailProjectParticipantsProjectTableFragment"
                              },
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "ProjectDetailProjectInformationTableFragment"
                              },
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v12/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProjectDetailsQuery",
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
                    "alias": null,
                    "args": (v1/*: any*/),
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
                                    "name": "isPm",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isMo",
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
                                "name": "Acc_LeadParticipantID__c",
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
                                    "kind": "Literal",
                                    "name": "orderBy",
                                    "value": {
                                      "Acc_AccountId__r": {
                                        "Name": {
                                          "nulls": "LAST",
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
                                            "concreteType": "EmailValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_EmailOfSFContact__c",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Contact",
                                            "kind": "LinkedField",
                                            "name": "Acc_ContactId__r",
                                            "plural": false,
                                            "selections": (v14/*: any*/),
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
                                              (v13/*: any*/),
                                              (v2/*: any*/)
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
                                            "selections": (v14/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_Role__c",
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
                                "storageKey": "Project_Contact_Links__r(first:2000,orderBy:{\"Acc_AccountId__r\":{\"Name\":{\"nulls\":\"LAST\",\"order\":\"ASC\"}}})"
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
                                          (v2/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Account",
                                            "kind": "LinkedField",
                                            "name": "Acc_AccountId__r",
                                            "plural": false,
                                            "selections": (v14/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantType__c",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_NonfundedParticipant__c",
                                            "plural": false,
                                            "selections": (v4/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_Postcode__c",
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
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Competition__c",
                                "kind": "LinkedField",
                                "name": "Acc_CompetitionId__r",
                                "plural": false,
                                "selections": (v14/*: any*/),
                                "storageKey": null
                              },
                              (v12/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateValue",
                                "kind": "LinkedField",
                                "name": "Acc_StartDate__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateValue",
                                "kind": "LinkedField",
                                "name": "Acc_EndDate__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DateValue",
                                "kind": "LinkedField",
                                "name": "Loan_LoanEndDate__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Loan_LoanAvailabilityPeriodLength__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Loan_LoanExtensionPeriodLength__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Loan_LoanRepaymentPeriodLength__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DoubleValue",
                                "kind": "LinkedField",
                                "name": "Acc_Duration__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              (v8/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "LongTextAreaValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectSummary__c",
                                "plural": false,
                                "selections": (v4/*: any*/),
                                "storageKey": null
                              },
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v7/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/)
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
    ]
  },
  "params": {
    "cacheID": "40fce23a977594e3a81cfa7446792522",
    "id": null,
    "metadata": {},
    "name": "ProjectDetailsQuery",
    "operationKind": "query",
    "text": "query ProjectDetailsQuery(\n  $projectId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              ...ProjectStatusFragment\n              ...ProjectDetailProjectContactLinkTableFragment\n              ...ProjectDetailProjectParticipantsProjectTableFragment\n              ...ProjectDetailProjectInformationTableFragment\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_CurrentPeriodStartDate__c {\n                value\n                displayValue\n              }\n              Acc_CurrentPeriodEndDate__c {\n                value\n                displayValue\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectDetailProjectContactLinkTableFragment on Acc_Project__c {\n  Id\n  isActive\n  roles {\n    isPm\n    isMo\n  }\n  Acc_LeadParticipantID__c {\n    value\n  }\n  Project_Contact_Links__r(orderBy: {Acc_AccountId__r: {Name: {order: ASC, nulls: LAST}}}, first: 2000) {\n    edges {\n      node {\n        Acc_EmailOfSFContact__c {\n          value\n        }\n        Acc_ContactId__r {\n          Name {\n            value\n          }\n        }\n        Acc_AccountId__r {\n          Name {\n            value\n          }\n          Id\n        }\n        Acc_UserId__r {\n          Name {\n            value\n          }\n        }\n        Acc_Role__c {\n          value\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectDetailProjectInformationTableFragment on Acc_Project__c {\n  Acc_CompetitionId__r {\n    Name {\n      value\n    }\n  }\n  Acc_CompetitionType__c {\n    value\n  }\n  Acc_StartDate__c {\n    value\n  }\n  Acc_EndDate__c {\n    value\n  }\n  Loan_LoanEndDate__c {\n    value\n  }\n  Loan_LoanAvailabilityPeriodLength__c {\n    value\n  }\n  Loan_LoanExtensionPeriodLength__c {\n    value\n  }\n  Loan_LoanRepaymentPeriodLength__c {\n    value\n  }\n  Acc_Duration__c {\n    value\n  }\n  Acc_NumberofPeriods__c {\n    value\n  }\n  Acc_ProjectSummary__c {\n    value\n  }\n}\n\nfragment ProjectDetailProjectParticipantsProjectTableFragment on Acc_Project__c {\n  Id\n  Acc_LeadParticipantID__c {\n    value\n  }\n  Acc_ProjectParticipantsProject__r {\n    edges {\n      node {\n        Id\n        Acc_AccountId__r {\n          Name {\n            value\n          }\n        }\n        Acc_ParticipantType__c {\n          value\n        }\n        Acc_ParticipantStatus__c {\n          value\n        }\n        Acc_NonfundedParticipant__c {\n          value\n        }\n        Acc_Postcode__c {\n          value\n        }\n      }\n    }\n  }\n}\n\nfragment ProjectStatusFragment on Acc_Project__c {\n  Acc_ProjectStatus__c {\n    value\n  }\n}\n"
  }
};
})();

(node as any).hash = "e93512a0dc1bab1d881836bc797aa3d1";

export default node;
