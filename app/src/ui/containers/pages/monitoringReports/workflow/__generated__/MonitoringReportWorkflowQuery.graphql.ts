/**
 * @generated SignedSource<<22eea9ff8ad89af32e6b2659776f297f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type MonitoringReportWorkflowQuery$variables = {
  monitoringReportId: string;
  projectId: string;
};
export type MonitoringReportWorkflowQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_MonitoringAnswer__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_AddComments__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_MonitoringHeader__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_MonitoringReportStatus__c: {
                readonly label: string | null | undefined;
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_PeriodEndDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_PeriodStartDate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectPeriodNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Project__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionComments__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Question__c: {
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
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_MonitoringQuestion__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_ActiveFlag__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_DisplayOrder__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionDescription__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionScore__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_QuestionText__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ScoredQuestion__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
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
              readonly roles: {
                readonly isAssociate: boolean;
                readonly isFc: boolean;
                readonly isMo: boolean;
                readonly isPm: boolean;
              };
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_StatusChange__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CreatedByAlias__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ExternalComment__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_MonitoringReport__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_NewMonitoringReportStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_PreviousMonitoringReportStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly CreatedDate: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
    };
  };
};
export type MonitoringReportWorkflowQuery = {
  response: MonitoringReportWorkflowQuery$data;
  variables: MonitoringReportWorkflowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "monitoringReportId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v2 = {
  "order": "DESC"
},
v3 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "monitoringReportId"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
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
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 1000
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Acc_QuestionName__c",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v9 = [
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
                    "kind": "Literal",
                    "name": "first",
                    "value": 2000
                  },
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "CreatedDate": (v2/*: any*/)
                    }
                  },
                  {
                    "fields": [
                      {
                        "fields": (v3/*: any*/),
                        "kind": "ObjectValue",
                        "name": "Acc_MonitoringReport__c"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "Acc_StatusChange__cConnection",
                "kind": "LinkedField",
                "name": "Acc_StatusChange__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_StatusChange__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_StatusChange__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewMonitoringReportStatus__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_PreviousMonitoringReportStatus__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_MonitoringReport__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_ExternalComment__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CreatedByAlias__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateTimeValue",
                            "kind": "LinkedField",
                            "name": "CreatedDate",
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
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v7/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "LastModifiedDate": (v2/*: any*/)
                    }
                  },
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": [
                              {
                                "fields": (v3/*: any*/),
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
                                "items": [
                                  {
                                    "fields": [
                                      {
                                        "fields": (v3/*: any*/),
                                        "kind": "ObjectValue",
                                        "name": "Acc_MonitoringHeader__c"
                                      }
                                    ],
                                    "kind": "ObjectValue",
                                    "name": "and.0"
                                  },
                                  {
                                    "kind": "Literal",
                                    "name": "and.1",
                                    "value": {
                                      "RecordType": {
                                        "Name": {
                                          "eq": "Monitoring Answer"
                                        }
                                      }
                                    }
                                  }
                                ],
                                "kind": "ListValue",
                                "name": "and"
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
                "concreteType": "Acc_MonitoringAnswer__cConnection",
                "kind": "LinkedField",
                "name": "Acc_MonitoringAnswer__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_MonitoringAnswer__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_MonitoringAnswer__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
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
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "DeveloperName",
                                "plural": false,
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_MonitoringHeader__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_Question__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_QuestionComments__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_MonitoringReportStatus__c",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
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
                            "concreteType": "DateTimeValue",
                            "kind": "LinkedField",
                            "name": "LastModifiedDate",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_Project__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectPeriodNumber__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_PeriodStartDate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_PeriodEndDate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_AddComments__c",
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
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v7/*: any*/)
                ],
                "concreteType": "Acc_MonitoringQuestion__cConnection",
                "kind": "LinkedField",
                "name": "Acc_MonitoringQuestion__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_MonitoringQuestion__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_MonitoringQuestion__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_DisplayOrder__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_QuestionScore__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_QuestionText__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_QuestionDescription__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_ActiveFlag__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_ScoredQuestion__c",
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
                "storageKey": "Acc_MonitoringQuestion__c(first:1000)"
              },
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
                          (v4/*: any*/),
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
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isAssociate",
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
    "name": "MonitoringReportWorkflowQuery",
    "selections": (v9/*: any*/),
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
    "name": "MonitoringReportWorkflowQuery",
    "selections": (v9/*: any*/)
  },
  "params": {
    "cacheID": "c918f0efb69d707c1afef5699215065f",
    "id": null,
    "metadata": {},
    "name": "MonitoringReportWorkflowQuery",
    "operationKind": "query",
    "text": "query MonitoringReportWorkflowQuery(\n  $projectId: ID!\n  $monitoringReportId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_StatusChange__c(where: {Acc_MonitoringReport__c: {eq: $monitoringReportId}}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_NewMonitoringReportStatus__c {\n                value\n              }\n              Acc_PreviousMonitoringReportStatus__c {\n                value\n              }\n              Acc_MonitoringReport__c {\n                value\n              }\n              Acc_ExternalComment__c {\n                value\n              }\n              Acc_CreatedByAlias__c {\n                value\n              }\n              CreatedDate {\n                value\n              }\n            }\n          }\n        }\n        Acc_MonitoringAnswer__c(where: {or: [{Id: {eq: $monitoringReportId}}, {and: [{Acc_MonitoringHeader__c: {eq: $monitoringReportId}}, {RecordType: {Name: {eq: \"Monitoring Answer\"}}}]}]}, orderBy: {LastModifiedDate: {order: DESC}}, first: 1000) {\n          edges {\n            node {\n              Id\n              RecordType {\n                Name {\n                  value\n                }\n                DeveloperName {\n                  value\n                }\n              }\n              Acc_MonitoringHeader__c {\n                value\n              }\n              Acc_Question__c {\n                value\n              }\n              Acc_QuestionComments__c {\n                value\n              }\n              Acc_QuestionName__c {\n                value\n              }\n              Acc_MonitoringReportStatus__c {\n                value\n                label\n              }\n              LastModifiedDate {\n                value\n              }\n              Acc_Project__c {\n                value\n              }\n              Acc_ProjectPeriodNumber__c {\n                value\n              }\n              Acc_PeriodStartDate__c {\n                value\n              }\n              Acc_PeriodEndDate__c {\n                value\n              }\n              Acc_AddComments__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_MonitoringQuestion__c(first: 1000) {\n          edges {\n            node {\n              Id\n              Acc_QuestionName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_QuestionScore__c {\n                value\n              }\n              Acc_QuestionText__c {\n                value\n              }\n              Acc_QuestionDescription__c {\n                value\n              }\n              Acc_ActiveFlag__c {\n                value\n              }\n              Acc_ScoredQuestion__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isMo\n                isFc\n                isPm\n                isAssociate\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2646440b71478e4be6e9ed2353adb333";

export default node;
