/**
 * @generated SignedSource<<ac1e3b55c8551c5cdff7e2ee4e5ed2b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
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
              readonly Acc_CompetitionId__r: {
                readonly Name: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodEndDate__c: {
                readonly displayValue: string | null | undefined;
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CurrentPeriodStartDate__c: {
                readonly displayValue: string | null | undefined;
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Duration__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_EndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_LeadParticipantID__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_MonitoringLevel__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_NumberofPeriods__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectNumber__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipantsProject__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_AccountId__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_AccountId__r: {
                      readonly Name: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly Acc_NonfundedParticipant__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantStatus__c: {
                      readonly label: string | null | undefined;
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantType__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_Postcode__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ProjectRole__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectSummary__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectTitle__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_StartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
              readonly Loan_LoanAvailabilityPeriodLength__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Loan_LoanEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Loan_LoanExtensionPeriodLength__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Loan_LoanRepaymentPeriodLength__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Project_Contact_Links__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_AccountId__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ContactId__r: {
                      readonly Name: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly Acc_EmailOfSFContact__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ProjectId__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_Role__c: {
                      readonly label: string | null | undefined;
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_UserId__r: {
                      readonly Name: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly isActive: boolean;
              readonly roles: {
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
                readonly isSalesforceSystemUser: boolean;
                readonly partnerRoles: ReadonlyArray<{
                  readonly isFc: boolean;
                  readonly isMo: boolean;
                  readonly isPm: boolean;
                  readonly partnerId: string;
                }>;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
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
  "name": "isPm",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v6 = [
  (v5/*: any*/)
],
v7 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "StringValue",
    "kind": "LinkedField",
    "name": "Name",
    "plural": false,
    "selections": (v6/*: any*/),
    "storageKey": null
  }
],
v8 = [
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "displayValue",
    "storageKey": null
  }
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_AccountId__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v10 = [
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "label",
    "storageKey": null
  }
],
v11 = [
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isSalesforceSystemUser",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Ext_Partner_Roles",
                                "kind": "LinkedField",
                                "name": "partnerRoles",
                                "plural": true,
                                "selections": [
                                  (v3/*: any*/),
                                  (v2/*: any*/),
                                  (v4/*: any*/),
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
                            "name": "Acc_CompetitionType__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Competition__c",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionId__r",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodEndDate__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodNumber__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_CurrentPeriodStartDate__c",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_Duration__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_EndDate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_LeadParticipantID__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_MonitoringLevel__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_NumberofPeriods__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectNumber__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectSummary__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_StartDate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Loan_LoanAvailabilityPeriodLength__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Loan_LoanEndDate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Loan_LoanExtensionPeriodLength__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Loan_LoanRepaymentPeriodLength__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 500
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
                                      (v1/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Account",
                                        "kind": "LinkedField",
                                        "name": "Acc_AccountId__r",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      (v9/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ParticipantType__c",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ParticipantStatus__c",
                                        "plural": false,
                                        "selections": (v10/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "BooleanValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_NonfundedParticipant__c",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "StringValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Postcode__c",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ProjectRole__c",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "Acc_ProjectParticipantsProject__r(first:500)"
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
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Contact",
                                        "kind": "LinkedField",
                                        "name": "Acc_ContactId__r",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      (v9/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "Acc_UserId__r",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_Role__c",
                                        "plural": false,
                                        "selections": (v10/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ProjectId__c",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
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
    "name": "ProjectDetailsQuery",
    "selections": (v11/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProjectDetailsQuery",
    "selections": (v11/*: any*/)
  },
  "params": {
    "cacheID": "fd1ab24b5c4bcab6674c4622ec08d30d",
    "id": null,
    "metadata": {},
    "name": "ProjectDetailsQuery",
    "operationKind": "query",
    "text": "query ProjectDetailsQuery(\n  $projectId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              isActive\n              roles {\n                isMo\n                isFc\n                isPm\n                isSalesforceSystemUser\n                partnerRoles {\n                  isFc\n                  isMo\n                  isPm\n                  partnerId\n                }\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_CompetitionId__r {\n                Name {\n                  value\n                }\n              }\n              Acc_CurrentPeriodEndDate__c {\n                value\n                displayValue\n              }\n              Acc_CurrentPeriodNumber__c {\n                value\n              }\n              Acc_CurrentPeriodStartDate__c {\n                value\n                displayValue\n              }\n              Acc_Duration__c {\n                value\n              }\n              Acc_EndDate__c {\n                value\n              }\n              Acc_LeadParticipantID__c {\n                value\n              }\n              Acc_MonitoringLevel__c {\n                value\n              }\n              Acc_NumberofPeriods__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_ProjectSummary__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_StartDate__c {\n                value\n              }\n              Loan_LoanAvailabilityPeriodLength__c {\n                value\n              }\n              Loan_LoanEndDate__c {\n                value\n              }\n              Loan_LoanExtensionPeriodLength__c {\n                value\n              }\n              Loan_LoanRepaymentPeriodLength__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r(first: 500) {\n                edges {\n                  node {\n                    Id\n                    Acc_AccountId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                    Acc_ParticipantType__c {\n                      value\n                    }\n                    Acc_ParticipantStatus__c {\n                      value\n                      label\n                    }\n                    Acc_NonfundedParticipant__c {\n                      value\n                    }\n                    Acc_Postcode__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                  }\n                }\n              }\n              Project_Contact_Links__r(orderBy: {Acc_AccountId__r: {Name: {order: ASC, nulls: LAST}}}, first: 2000) {\n                edges {\n                  node {\n                    Acc_EmailOfSFContact__c {\n                      value\n                    }\n                    Acc_ContactId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_AccountId__c {\n                      value\n                    }\n                    Acc_UserId__r {\n                      Name {\n                        value\n                      }\n                    }\n                    Acc_Role__c {\n                      value\n                      label\n                    }\n                    Acc_ProjectId__c {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "daf1a76e1e580b538bebe42d4d236b5b";

export default node;
