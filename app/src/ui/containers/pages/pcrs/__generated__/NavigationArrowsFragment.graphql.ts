/**
 * @generated SignedSource<<6a60474c9e90ef0f2dbe7c747dae5954>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NavigationArrowsFragment$data = {
  readonly query: {
    readonly NavigationArrows_ProjectChangeRequest: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly Acc_Project__c: {
            readonly value: string | null;
          } | null;
          readonly Acc_RequestHeader__c: {
            readonly value: string | null;
          } | null;
          readonly Id: string;
          readonly RecordType: {
            readonly Name: {
              readonly label: string | null;
              readonly value: string | null;
            } | null;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  };
  readonly " $fragmentType": "NavigationArrowsFragment";
};
export type NavigationArrowsFragment$key = {
  readonly " $data"?: NavigationArrowsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NavigationArrowsFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "eq",
    "variableName": "pcrId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "pcrId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "NavigationArrowsFragment",
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
          "alias": "NavigationArrows_ProjectChangeRequest",
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
                          "fields": (v0/*: any*/),
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
                          "fields": (v0/*: any*/),
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
                      "concreteType": "IDValue",
                      "kind": "LinkedField",
                      "name": "Acc_Project__c",
                      "plural": false,
                      "selections": (v2/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "IDValue",
                      "kind": "LinkedField",
                      "name": "Acc_RequestHeader__c",
                      "plural": false,
                      "selections": (v2/*: any*/),
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
                            (v1/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "label",
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
  "type": "UIAPI",
  "abstractKey": null
};
})();

(node as any).hash = "1a278f29b9f2cfd82943fba53427ed3f";

export default node;
