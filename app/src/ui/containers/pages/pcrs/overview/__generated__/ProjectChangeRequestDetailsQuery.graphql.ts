/**
 * @generated SignedSource<<663eaffc01fee508973adbbf418916de>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProjectChangeRequestDetailsQuery$variables = {
  pcrId: string;
  projectId: string;
};
export type ProjectChangeRequestDetailsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectChangeRequest__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_MarkedasComplete__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Project_Change_Requests__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_CommercialWork__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_ExistingPartnerName__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_MarkedasComplete__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_NewOrganisationName__c: {
                      readonly value: any | null | undefined;
                    } | null | undefined;
                    readonly Acc_OrganisationName__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_OtherFunding__c: {
                      readonly value: boolean | null | undefined;
                    } | null | undefined;
                    readonly Acc_ParticipantType__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_ProjectRole__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_RequestHeader__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_RequestNumber__c: {
                      readonly value: number | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                    readonly RecordType: {
                      readonly DeveloperName: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
              } | null | undefined;
              readonly Acc_RequestHeader__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_RequestNumber__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_Project__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionId__r: {
                readonly Acc_TypeofAid__c: {
                  readonly value: string | null | undefined;
                } | null | undefined;
              } | null | undefined;
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
              readonly Acc_NewProjectChangeRequestStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ParticipantVisibility__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_PreviousProjectChangeRequestStatus__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectChangeRequest__c: {
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
export type ProjectChangeRequestDetailsQuery = {
  response: ProjectChangeRequestDetailsQuery$data;
  variables: ProjectChangeRequestDetailsQuery$variables;
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
  "kind": "Literal",
  "name": "first",
  "value": 2000
},
v3 = {
  "order": "DESC"
},
v4 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "projectId"
  }
],
v5 = {
  "fields": (v4/*: any*/),
  "kind": "ObjectValue",
  "name": "Acc_Project__c"
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v8 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "Acc_RequestNumber__c": (v3/*: any*/)
  }
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "IDValue",
  "kind": "LinkedField",
  "name": "Acc_RequestHeader__c",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "DoubleValue",
  "kind": "LinkedField",
  "name": "Acc_RequestNumber__c",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_MarkedasComplete__c",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v12 = [
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
                  (v2/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "CreatedDate": (v3/*: any*/)
                    }
                  },
                  {
                    "fields": [
                      {
                        "items": [
                          {
                            "fields": [
                              {
                                "fields": [
                                  (v5/*: any*/)
                                ],
                                "kind": "ObjectValue",
                                "name": "Acc_ProjectChangeRequest__r"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.0"
                          },
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
                                "name": "Acc_ProjectChangeRequest__c"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "and.1"
                          }
                        ],
                        "kind": "ListValue",
                        "name": "and"
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
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectChangeRequest__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_PreviousProjectChangeRequestStatus__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateTimeValue",
                            "kind": "LinkedField",
                            "name": "CreatedDate",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CreatedByAlias__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewProjectChangeRequestStatus__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_ExternalComment__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_ParticipantVisibility__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
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
                  {
                    "fields": [
                      {
                        "fields": (v4/*: any*/),
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
                          (v6/*: any*/),
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
                                "name": "isFc",
                                "storageKey": null
                              },
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
                            "selections": (v7/*: any*/),
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
                                "name": "Acc_TypeofAid__c",
                                "plural": false,
                                "selections": (v7/*: any*/),
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
                            "name": "Acc_ProjectTitle__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectStatus__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
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
                  (v2/*: any*/),
                  (v8/*: any*/),
                  {
                    "fields": [
                      (v5/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "RecordType",
                        "value": {
                          "DeveloperName": {
                            "eq": "Acc_RequestHeader"
                          }
                        }
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
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Status__c",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": [
                              (v2/*: any*/),
                              (v8/*: any*/)
                            ],
                            "concreteType": "Acc_ProjectChangeRequest__cConnection",
                            "kind": "LinkedField",
                            "name": "Acc_Project_Change_Requests__r",
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
                                      (v6/*: any*/),
                                      (v11/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "LongTextAreaValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_NewOrganisationName__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "BooleanValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_OtherFunding__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "BooleanValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_CommercialWork__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "StringValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_OrganisationName__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ParticipantType__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "TextAreaValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ExistingPartnerName__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PicklistValue",
                                        "kind": "LinkedField",
                                        "name": "Acc_ProjectRole__c",
                                        "plural": false,
                                        "selections": (v7/*: any*/),
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
                                            "name": "DeveloperName",
                                            "plural": false,
                                            "selections": (v7/*: any*/),
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
                            "storageKey": "Acc_Project_Change_Requests__r(first:2000,orderBy:{\"Acc_RequestNumber__c\":{\"order\":\"DESC\"}})"
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
    "name": "ProjectChangeRequestDetailsQuery",
    "selections": (v12/*: any*/),
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
    "name": "ProjectChangeRequestDetailsQuery",
    "selections": (v12/*: any*/)
  },
  "params": {
    "cacheID": "4d9f7bdd898fcdbbd1644f9d6427496e",
    "id": null,
    "metadata": {},
    "name": "ProjectChangeRequestDetailsQuery",
    "operationKind": "query",
    "text": "query ProjectChangeRequestDetailsQuery(\n  $projectId: ID!\n  $pcrId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_StatusChange__c(where: {and: [{Acc_ProjectChangeRequest__r: {Acc_Project__c: {eq: $projectId}}}, {Acc_ProjectChangeRequest__c: {eq: $pcrId}}]}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ProjectChangeRequest__c {\n                value\n              }\n              Acc_PreviousProjectChangeRequestStatus__c {\n                value\n              }\n              CreatedDate {\n                value\n              }\n              Acc_CreatedByAlias__c {\n                value\n              }\n              Acc_NewProjectChangeRequestStatus__c {\n                value\n              }\n              Acc_ExternalComment__c {\n                value\n              }\n              Acc_ParticipantVisibility__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isFc\n                isMo\n                isPm\n                isAssociate\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_CompetitionId__r {\n                Acc_TypeofAid__c {\n                  value\n                }\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectChangeRequest__c(first: 2000, where: {Acc_Project__c: {eq: $projectId}, RecordType: {DeveloperName: {eq: \"Acc_RequestHeader\"}}}, orderBy: {Acc_RequestNumber__c: {order: DESC}}) {\n          edges {\n            node {\n              Id\n              Acc_Status__c {\n                value\n              }\n              Acc_RequestHeader__c {\n                value\n              }\n              Acc_RequestNumber__c {\n                value\n              }\n              Acc_MarkedasComplete__c {\n                value\n              }\n              Acc_Project_Change_Requests__r(first: 2000, orderBy: {Acc_RequestNumber__c: {order: DESC}}) {\n                edges {\n                  node {\n                    Id\n                    Acc_MarkedasComplete__c {\n                      value\n                    }\n                    Acc_NewOrganisationName__c {\n                      value\n                    }\n                    Acc_OtherFunding__c {\n                      value\n                    }\n                    Acc_CommercialWork__c {\n                      value\n                    }\n                    Acc_OrganisationName__c {\n                      value\n                    }\n                    Acc_RequestHeader__c {\n                      value\n                    }\n                    Acc_RequestNumber__c {\n                      value\n                    }\n                    Acc_ParticipantType__c {\n                      value\n                    }\n                    Acc_ExistingPartnerName__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    RecordType {\n                      DeveloperName {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3df87f37c8d6cb2c14176bda7eb5c2c1";

export default node;
