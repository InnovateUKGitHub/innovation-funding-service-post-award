/**
 * @generated SignedSource<<202eab2e3bd312682f026d5dc667923a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectChangeRequestPrepareQuery$variables = {
  pcrId: string;
  projectId: string;
};
export type ProjectChangeRequestPrepareQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_ProjectChangeRequest__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Comments__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_MarkedasComplete__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Project_Change_Requests__r: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly Acc_Comments__c: {
                      readonly value: any | null | undefined;
                    } | null | undefined;
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
                    readonly Acc_Project__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Acc_Status__c: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
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
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_MonitoringLevel__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectParticipantsProject__r: {
                readonly totalCount: number;
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
        readonly OtherPCRs: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      };
      readonly " $fragmentSpreads": FragmentRefs<"PageFragment">;
    };
  };
};
export type ProjectChangeRequestPrepareQuery = {
  response: ProjectChangeRequestPrepareQuery$data;
  variables: ProjectChangeRequestPrepareQuery$variables;
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
v6 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrId"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v9 = [
  (v8/*: any*/)
],
v10 = {
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
                  "fields": (v6/*: any*/),
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
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_ProjectChangeRequest__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "TextAreaValue",
              "kind": "LinkedField",
              "name": "Acc_PreviousProjectChangeRequestStatus__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DateTimeValue",
              "kind": "LinkedField",
              "name": "CreatedDate",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StringValue",
              "kind": "LinkedField",
              "name": "Acc_CreatedByAlias__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "TextAreaValue",
              "kind": "LinkedField",
              "name": "Acc_NewProjectChangeRequestStatus__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "LongTextAreaValue",
              "kind": "LinkedField",
              "name": "Acc_ExternalComment__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BooleanValue",
              "kind": "LinkedField",
              "name": "Acc_ParticipantVisibility__c",
              "plural": false,
              "selections": (v9/*: any*/),
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
v11 = {
  "fields": [
    {
      "fields": (v4/*: any*/),
      "kind": "ObjectValue",
      "name": "Id"
    }
  ],
  "kind": "ObjectValue",
  "name": "where"
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFc",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMo",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPm",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAssociate",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": [
    (v11/*: any*/)
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
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Ext_Project_Roles",
              "kind": "LinkedField",
              "name": "roles",
              "plural": false,
              "selections": [
                (v12/*: any*/),
                (v13/*: any*/),
                (v14/*: any*/),
                (v15/*: any*/)
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
              "selections": (v9/*: any*/),
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
                  "selections": (v9/*: any*/),
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
              "name": "Acc_MonitoringLevel__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
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
                  "kind": "ScalarField",
                  "name": "totalCount",
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
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_Status__c",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v18 = {
  "alias": "OtherPCRs",
  "args": [
    (v2/*: any*/),
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "Acc_RequestNumber__c": (v3/*: any*/)
      }
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
            (v7/*: any*/),
            (v17/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "Acc_ProjectChangeRequest__c(first:2000,orderBy:{\"Acc_RequestNumber__c\":{\"order\":\"DESC\"}})"
},
v19 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "PicklistValue",
  "kind": "LinkedField",
  "name": "Acc_MarkedasComplete__c",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "LongTextAreaValue",
  "kind": "LinkedField",
  "name": "Acc_Comments__c",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": [
    (v19/*: any*/),
    {
      "fields": [
        (v5/*: any*/),
        {
          "fields": (v6/*: any*/),
          "kind": "ObjectValue",
          "name": "Id"
        },
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
            (v7/*: any*/),
            (v17/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "IDValue",
              "kind": "LinkedField",
              "name": "Acc_RequestHeader__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DoubleValue",
              "kind": "LinkedField",
              "name": "Acc_RequestNumber__c",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            (v20/*: any*/),
            (v21/*: any*/),
            {
              "alias": null,
              "args": [
                (v2/*: any*/)
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
                        (v7/*: any*/),
                        (v21/*: any*/),
                        (v17/*: any*/),
                        (v20/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "LongTextAreaValue",
                          "kind": "LinkedField",
                          "name": "Acc_NewOrganisationName__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BooleanValue",
                          "kind": "LinkedField",
                          "name": "Acc_OtherFunding__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BooleanValue",
                          "kind": "LinkedField",
                          "name": "Acc_CommercialWork__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "StringValue",
                          "kind": "LinkedField",
                          "name": "Acc_OrganisationName__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PicklistValue",
                          "kind": "LinkedField",
                          "name": "Acc_ParticipantType__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "TextAreaValue",
                          "kind": "LinkedField",
                          "name": "Acc_ExistingPartnerName__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PicklistValue",
                          "kind": "LinkedField",
                          "name": "Acc_ProjectRole__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "IDValue",
                          "kind": "LinkedField",
                          "name": "Acc_Project__c",
                          "plural": false,
                          "selections": (v9/*: any*/),
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
                                (v8/*: any*/),
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
                              "selections": (v9/*: any*/),
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
              "storageKey": "Acc_Project_Change_Requests__r(first:2000)"
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
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalesforceSystemUser",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectChangeRequestPrepareQuery",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "PageFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RecordQuery",
                "kind": "LinkedField",
                "name": "query",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v16/*: any*/),
                  (v18/*: any*/),
                  (v22/*: any*/)
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectChangeRequestPrepareQuery",
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
                    "alias": "Page",
                    "args": [
                      (v19/*: any*/),
                      (v11/*: any*/)
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
                              (v7/*: any*/),
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
                                  (v13/*: any*/),
                                  (v12/*: any*/),
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v23/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Ext_Partner_Roles",
                                    "kind": "LinkedField",
                                    "name": "partnerRoles",
                                    "plural": true,
                                    "selections": [
                                      (v13/*: any*/),
                                      (v12/*: any*/),
                                      (v14/*: any*/),
                                      (v15/*: any*/),
                                      (v23/*: any*/),
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
                                "name": "Acc_ProjectNumber__c",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StringValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectTitle__c",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PicklistValue",
                                "kind": "LinkedField",
                                "name": "Acc_ProjectStatus__c",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
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
                                          (v7/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "PicklistValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_ParticipantStatus__c",
                                            "plural": false,
                                            "selections": (v9/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "BooleanValue",
                                            "kind": "LinkedField",
                                            "name": "Acc_FlaggedParticipant__c",
                                            "plural": false,
                                            "selections": (v9/*: any*/),
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
                  },
                  (v10/*: any*/),
                  (v16/*: any*/),
                  (v18/*: any*/),
                  (v22/*: any*/)
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
    "cacheID": "45d08b7ce47c937d7eab60d130e0b79a",
    "id": null,
    "metadata": {},
    "name": "ProjectChangeRequestPrepareQuery",
    "operationKind": "query",
    "text": "query ProjectChangeRequestPrepareQuery(\n  $projectId: ID!\n  $pcrId: ID!\n) {\n  salesforce {\n    uiapi {\n      ...PageFragment\n      query {\n        Acc_StatusChange__c(where: {and: [{Acc_ProjectChangeRequest__r: {Acc_Project__c: {eq: $projectId}}}, {Acc_ProjectChangeRequest__c: {eq: $pcrId}}]}, orderBy: {CreatedDate: {order: DESC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_ProjectChangeRequest__c {\n                value\n              }\n              Acc_PreviousProjectChangeRequestStatus__c {\n                value\n              }\n              CreatedDate {\n                value\n              }\n              Acc_CreatedByAlias__c {\n                value\n              }\n              Acc_NewProjectChangeRequestStatus__c {\n                value\n              }\n              Acc_ExternalComment__c {\n                value\n              }\n              Acc_ParticipantVisibility__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}) {\n          edges {\n            node {\n              Id\n              roles {\n                isFc\n                isMo\n                isPm\n                isAssociate\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_CompetitionId__r {\n                Acc_TypeofAid__c {\n                  value\n                }\n              }\n              Acc_MonitoringLevel__c {\n                value\n              }\n              Acc_ProjectParticipantsProject__r {\n                totalCount\n              }\n            }\n          }\n        }\n        OtherPCRs: Acc_ProjectChangeRequest__c(first: 2000, orderBy: {Acc_RequestNumber__c: {order: DESC}}) {\n          edges {\n            node {\n              Id\n              Acc_Status__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_ProjectChangeRequest__c(first: 1, where: {Id: {eq: $pcrId}, Acc_Project__c: {eq: $projectId}, RecordType: {DeveloperName: {eq: \"Acc_RequestHeader\"}}}) {\n          edges {\n            node {\n              Id\n              Acc_Status__c {\n                value\n              }\n              Acc_RequestHeader__c {\n                value\n              }\n              Acc_RequestNumber__c {\n                value\n              }\n              Acc_MarkedasComplete__c {\n                value\n              }\n              Acc_Comments__c {\n                value\n              }\n              Acc_Project_Change_Requests__r(first: 2000) {\n                edges {\n                  node {\n                    Id\n                    Acc_Comments__c {\n                      value\n                    }\n                    Acc_Status__c {\n                      value\n                    }\n                    Acc_MarkedasComplete__c {\n                      value\n                    }\n                    Acc_NewOrganisationName__c {\n                      value\n                    }\n                    Acc_OtherFunding__c {\n                      value\n                    }\n                    Acc_CommercialWork__c {\n                      value\n                    }\n                    Acc_OrganisationName__c {\n                      value\n                    }\n                    Acc_ParticipantType__c {\n                      value\n                    }\n                    Acc_ExistingPartnerName__c {\n                      value\n                    }\n                    Acc_ProjectRole__c {\n                      value\n                    }\n                    Acc_Project__c {\n                      value\n                    }\n                    RecordType {\n                      Name {\n                        value\n                        label\n                      }\n                      DeveloperName {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PageFragment on UIAPI {\n  query {\n    Page: Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n      edges {\n        node {\n          Id\n          isActive\n          roles {\n            isMo\n            isFc\n            isPm\n            isAssociate\n            isSalesforceSystemUser\n            partnerRoles {\n              isMo\n              isFc\n              isPm\n              isAssociate\n              isSalesforceSystemUser\n              partnerId\n            }\n          }\n          Acc_ProjectNumber__c {\n            value\n          }\n          Acc_ProjectTitle__c {\n            value\n          }\n          Acc_ProjectStatus__c {\n            value\n          }\n          Acc_ProjectParticipantsProject__r {\n            edges {\n              node {\n                Id\n                Acc_ParticipantStatus__c {\n                  value\n                }\n                Acc_FlaggedParticipant__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "96da5dc822f70f41a1d33c46d6397307";

export default node;
