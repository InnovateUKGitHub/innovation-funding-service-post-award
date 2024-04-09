/**
 * @generated SignedSource<<0b785cfd7b043dc232f897a7015aca49>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SpendProfileCostsQuery$variables = {
  pcrItemId: string;
  projectId: string;
};
export type SpendProfileCostsQuery$data = {
  readonly salesforce: {
    readonly uiapi: {
      readonly query: {
        readonly Acc_CostCategory__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CompetitionType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostCategoryName__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_DisplayOrder__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OrganisationType__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Id: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly Acc_IFSSpendProfile__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CostCategoryID__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_CostEach__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_CostPerItem__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Country__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_DateSecured__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_DaysSpentOnProject__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_DepreciationPeriod__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_GrossCostOfRole__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ItemDescription__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_NetPresentValue__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_NewOrExisting__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_NumberOfTimes__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_OverheadRate__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_ProjectChangeRequest__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly Acc_Quantity__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Rate__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_ResidualValue__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_RoleAndDescription__c: {
                readonly value: any | null | undefined;
              } | null | undefined;
              readonly Acc_TotalCost__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Acc_Utilisation__c: {
                readonly value: number | null | undefined;
              } | null | undefined;
              readonly Id: string;
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
        readonly Acc_ProjectChangeRequest__c: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly Acc_CommercialWork__c: {
                readonly value: boolean | null | undefined;
              } | null | undefined;
              readonly Acc_MarkedasComplete__c: {
                readonly value: string | null | undefined;
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
              readonly Acc_Status__c: {
                readonly value: string | null | undefined;
              } | null | undefined;
              readonly ContentDocumentLinks: {
                readonly edges: ReadonlyArray<{
                  readonly node: {
                    readonly ContentDocument: {
                      readonly ContentSize: {
                        readonly value: number | null | undefined;
                      } | null | undefined;
                      readonly CreatedBy: {
                        readonly Id: string;
                        readonly Name: {
                          readonly value: string | null | undefined;
                        } | null | undefined;
                      } | null | undefined;
                      readonly CreatedDate: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Description: {
                        readonly value: any | null | undefined;
                      } | null | undefined;
                      readonly FileExtension: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Id: string;
                      readonly LastModifiedBy: {
                        readonly ContactId: {
                          readonly value: string | null | undefined;
                        } | null | undefined;
                      } | null | undefined;
                      readonly LatestPublishedVersionId: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                      readonly Title: {
                        readonly value: string | null | undefined;
                      } | null | undefined;
                    } | null | undefined;
                    readonly Id: string;
                    readonly LinkedEntityId: {
                      readonly value: string | null | undefined;
                    } | null | undefined;
                    readonly isFeedAttachment: boolean;
                    readonly isOwner: boolean;
                  } | null | undefined;
                } | null | undefined> | null | undefined;
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
      };
    };
  };
};
export type SpendProfileCostsQuery = {
  response: SpendProfileCostsQuery$data;
  variables: SpendProfileCostsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pcrItemId"
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
  "order": "ASC"
},
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
v7 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrItemId"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "Name",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "StringValue",
  "kind": "LinkedField",
  "name": "DeveloperName",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v10 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
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
                  (v2/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": {
                      "Acc_DisplayOrder__c": (v3/*: any*/)
                    }
                  }
                ],
                "concreteType": "Acc_CostCategory__cConnection",
                "kind": "LinkedField",
                "name": "Acc_CostCategory__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_CostCategory__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_CostCategory__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryName__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
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
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_OrganisationType__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_CompetitionType__c",
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
                "storageKey": "Acc_CostCategory__c(first:2000,orderBy:{\"Acc_DisplayOrder__c\":{\"order\":\"ASC\"}})"
              },
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
                            "kind": "Literal",
                            "name": "and.0",
                            "value": {
                              "RecordType": {
                                "DeveloperName": {
                                  "eq": "PCR_Spend_Profile"
                                }
                              }
                            }
                          },
                          {
                            "fields": [
                              {
                                "fields": (v7/*: any*/),
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
                "concreteType": "Acc_IFSSpendProfile__cConnection",
                "kind": "LinkedField",
                "name": "Acc_IFSSpendProfile__c",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Acc_IFSSpendProfile__cEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Acc_IFSSpendProfile__c",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostCategoryID__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IDValue",
                            "kind": "LinkedField",
                            "name": "Acc_ProjectChangeRequest__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_TotalCost__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_ItemDescription__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DateValue",
                            "kind": "LinkedField",
                            "name": "Acc_DateSecured__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_GrossCostOfRole__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_DaysSpentOnProject__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_Rate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_OverheadRate__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_Quantity__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostPerItem__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_Country__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "LongTextAreaValue",
                            "kind": "LinkedField",
                            "name": "Acc_RoleAndDescription__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_NewOrExisting__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_DepreciationPeriod__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_NetPresentValue__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_ResidualValue__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PercentValue",
                            "kind": "LinkedField",
                            "name": "Acc_Utilisation__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "DoubleValue",
                            "kind": "LinkedField",
                            "name": "Acc_NumberOfTimes__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CurrencyValue",
                            "kind": "LinkedField",
                            "name": "Acc_CostEach__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
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
                              (v8/*: any*/),
                              (v9/*: any*/)
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
              {
                "alias": null,
                "args": [
                  (v10/*: any*/),
                  {
                    "fields": [
                      {
                        "fields": (v7/*: any*/),
                        "kind": "ObjectValue",
                        "name": "Id"
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
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_CommercialWork__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_MarkedasComplete__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StringValue",
                            "kind": "LinkedField",
                            "name": "Acc_OrganisationName__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BooleanValue",
                            "kind": "LinkedField",
                            "name": "Acc_OtherFunding__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
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
                            "name": "Acc_ProjectRole__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PicklistValue",
                            "kind": "LinkedField",
                            "name": "Acc_Status__c",
                            "plural": false,
                            "selections": (v6/*: any*/),
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
                              (v9/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              (v2/*: any*/),
                              {
                                "kind": "Literal",
                                "name": "orderBy",
                                "value": {
                                  "ContentDocument": {
                                    "CreatedDate": {
                                      "order": "DESC"
                                    }
                                  }
                                }
                              }
                            ],
                            "concreteType": "ContentDocumentLinkConnection",
                            "kind": "LinkedField",
                            "name": "ContentDocumentLinks",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ContentDocumentLinkEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ContentDocumentLink",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v4/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "IDValue",
                                        "kind": "LinkedField",
                                        "name": "LinkedEntityId",
                                        "plural": false,
                                        "selections": (v6/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "isFeedAttachment",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "isOwner",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "ContentDocument",
                                        "kind": "LinkedField",
                                        "name": "ContentDocument",
                                        "plural": false,
                                        "selections": [
                                          (v4/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "User",
                                            "kind": "LinkedField",
                                            "name": "LastModifiedBy",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "IDValue",
                                                "kind": "LinkedField",
                                                "name": "ContactId",
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
                                            "concreteType": "LongTextAreaValue",
                                            "kind": "LinkedField",
                                            "name": "Description",
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
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IDValue",
                                            "kind": "LinkedField",
                                            "name": "LatestPublishedVersionId",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "FileExtension",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "StringValue",
                                            "kind": "LinkedField",
                                            "name": "Title",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "IntValue",
                                            "kind": "LinkedField",
                                            "name": "ContentSize",
                                            "plural": false,
                                            "selections": (v6/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "User",
                                            "kind": "LinkedField",
                                            "name": "CreatedBy",
                                            "plural": false,
                                            "selections": [
                                              (v8/*: any*/),
                                              (v4/*: any*/)
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
                            "storageKey": "ContentDocumentLinks(first:2000,orderBy:{\"ContentDocument\":{\"CreatedDate\":{\"order\":\"DESC\"}}})"
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
                  (v10/*: any*/),
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
                                "name": "isPm",
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
                                "name": "isMo",
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
                            "name": "Acc_CompetitionType__c",
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
    "name": "SpendProfileCostsQuery",
    "selections": (v11/*: any*/),
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
    "name": "SpendProfileCostsQuery",
    "selections": (v11/*: any*/)
  },
  "params": {
    "cacheID": "679947a15df52d5529c01891587cf3f5",
    "id": null,
    "metadata": {},
    "name": "SpendProfileCostsQuery",
    "operationKind": "query",
    "text": "query SpendProfileCostsQuery(\n  $projectId: ID!\n  $pcrItemId: ID!\n) {\n  salesforce {\n    uiapi {\n      query {\n        Acc_CostCategory__c(first: 2000, orderBy: {Acc_DisplayOrder__c: {order: ASC}}) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryName__c {\n                value\n              }\n              Acc_DisplayOrder__c {\n                value\n              }\n              Acc_OrganisationType__c {\n                value\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n            }\n          }\n        }\n        Acc_IFSSpendProfile__c(where: {and: [{RecordType: {DeveloperName: {eq: \"PCR_Spend_Profile\"}}}, {Acc_ProjectChangeRequest__c: {eq: $pcrItemId}}]}, orderBy: {CreatedDate: {order: ASC}}, first: 2000) {\n          edges {\n            node {\n              Id\n              Acc_CostCategoryID__c {\n                value\n              }\n              Acc_ProjectChangeRequest__c {\n                value\n              }\n              Acc_TotalCost__c {\n                value\n              }\n              Acc_ItemDescription__c {\n                value\n              }\n              Acc_DateSecured__c {\n                value\n              }\n              Acc_GrossCostOfRole__c {\n                value\n              }\n              Acc_DaysSpentOnProject__c {\n                value\n              }\n              Acc_Rate__c {\n                value\n              }\n              Acc_OverheadRate__c {\n                value\n              }\n              Acc_Quantity__c {\n                value\n              }\n              Acc_CostPerItem__c {\n                value\n              }\n              Acc_Country__c {\n                value\n              }\n              Acc_RoleAndDescription__c {\n                value\n              }\n              Acc_NewOrExisting__c {\n                value\n              }\n              Acc_DepreciationPeriod__c {\n                value\n              }\n              Acc_NetPresentValue__c {\n                value\n              }\n              Acc_ResidualValue__c {\n                value\n              }\n              Acc_Utilisation__c {\n                value\n              }\n              Acc_NumberOfTimes__c {\n                value\n              }\n              Acc_CostEach__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                }\n                DeveloperName {\n                  value\n                }\n              }\n            }\n          }\n        }\n        Acc_ProjectChangeRequest__c(where: {Id: {eq: $pcrItemId}}, first: 1) {\n          edges {\n            node {\n              Id\n              Acc_CommercialWork__c {\n                value\n              }\n              Acc_MarkedasComplete__c {\n                value\n              }\n              Acc_OrganisationName__c {\n                value\n              }\n              Acc_OtherFunding__c {\n                value\n              }\n              Acc_ParticipantType__c {\n                value\n              }\n              Acc_ProjectRole__c {\n                value\n              }\n              Acc_Status__c {\n                value\n              }\n              RecordType {\n                Name {\n                  value\n                  label\n                }\n                DeveloperName {\n                  value\n                }\n              }\n              ContentDocumentLinks(first: 2000, orderBy: {ContentDocument: {CreatedDate: {order: DESC}}}) {\n                edges {\n                  node {\n                    Id\n                    LinkedEntityId {\n                      value\n                    }\n                    isFeedAttachment\n                    isOwner\n                    ContentDocument {\n                      Id\n                      LastModifiedBy {\n                        ContactId {\n                          value\n                        }\n                      }\n                      Description {\n                        value\n                      }\n                      CreatedDate {\n                        value\n                      }\n                      LatestPublishedVersionId {\n                        value\n                      }\n                      FileExtension {\n                        value\n                      }\n                      Title {\n                        value\n                      }\n                      ContentSize {\n                        value\n                      }\n                      CreatedBy {\n                        Name {\n                          value\n                        }\n                        Id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        Acc_Project__c(where: {Id: {eq: $projectId}}, first: 1) {\n          edges {\n            node {\n              Id\n              roles {\n                isPm\n                isFc\n                isMo\n                isAssociate\n              }\n              Acc_CompetitionType__c {\n                value\n              }\n              Acc_ProjectNumber__c {\n                value\n              }\n              Acc_ProjectTitle__c {\n                value\n              }\n              Acc_ProjectStatus__c {\n                value\n              }\n              Acc_CompetitionId__r {\n                Acc_TypeofAid__c {\n                  value\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "34bfcd026db239c25b291b05bc170777";

export default node;
