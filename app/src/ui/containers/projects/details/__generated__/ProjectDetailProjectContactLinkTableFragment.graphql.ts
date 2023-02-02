/**
 * @generated SignedSource<<6e5c194bde2026afaeca5295614eb434>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDetailProjectContactLinkTableFragment$data = {
  readonly Id: string;
  readonly Project_Contact_Links__r: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly Acc_AccountId__r: {
          readonly Id: string;
          readonly Name: {
            readonly value: string | null;
          } | null;
        } | null;
        readonly Acc_ContactId__r: {
          readonly Name: {
            readonly value: string | null;
          } | null;
        } | null;
        readonly Acc_EmailOfSFContact__c: {
          readonly value: string | null;
        } | null;
        readonly Acc_Role__c: {
          readonly value: string | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
  readonly isActive: boolean;
  readonly roles: {
    readonly isMo: boolean;
    readonly isPm: boolean;
  };
  readonly " $fragmentType": "ProjectDetailProjectContactLinkTableFragment";
};
export type ProjectDetailProjectContactLinkTableFragment$key = {
  readonly " $data"?: ProjectDetailProjectContactLinkTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectDetailProjectContactLinkTableFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Id",
  "storageKey": null
},
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectDetailProjectContactLinkTableFragment",
  "selections": [
    (v0/*: any*/),
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
                  "selections": (v1/*: any*/),
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
                    (v2/*: any*/)
                  ],
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
                    (v2/*: any*/),
                    (v0/*: any*/)
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
      "storageKey": null
    }
  ],
  "type": "Acc_Project__c",
  "abstractKey": null
};
})();

(node as any).hash = "2b3db498f763dd04002d5a9c2616d246";

export default node;
