/**
 * @generated SignedSource<<dd5e1b70c53bcdefc4da58b89d759e60>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDetailProjectParticipantsProjectTableFragment$data = {
  readonly Acc_LeadParticipantID__c: {
    readonly value: string | null;
  } | null;
  readonly Acc_ProjectParticipantsProject__r: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly Acc_AccountId__r: {
          readonly Name: {
            readonly value: string | null;
          } | null;
        } | null;
        readonly Acc_NonfundedParticipant__c: {
          readonly value: boolean | null;
        } | null;
        readonly Acc_ParticipantStatus__c: {
          readonly value: string | null;
        } | null;
        readonly Acc_ParticipantType__c: {
          readonly value: string | null;
        } | null;
        readonly Acc_Postcode__c: {
          readonly value: string | null;
        } | null;
        readonly Id: string;
      } | null;
    } | null> | null;
  } | null;
  readonly Id: string;
  readonly " $fragmentType": "ProjectDetailProjectParticipantsProjectTableFragment";
};
export type ProjectDetailProjectParticipantsProjectTableFragment$key = {
  readonly " $data"?: ProjectDetailProjectParticipantsProjectTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectDetailProjectParticipantsProjectTableFragment">;
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectDetailProjectParticipantsProjectTableFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "StringValue",
      "kind": "LinkedField",
      "name": "Acc_LeadParticipantID__c",
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Account",
                  "kind": "LinkedField",
                  "name": "Acc_AccountId__r",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StringValue",
                      "kind": "LinkedField",
                      "name": "Name",
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
                  "name": "Acc_ParticipantType__c",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "PicklistValue",
                  "kind": "LinkedField",
                  "name": "Acc_ParticipantStatus__c",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "BooleanValue",
                  "kind": "LinkedField",
                  "name": "Acc_NonfundedParticipant__c",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Acc_Postcode__c",
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
      "storageKey": "Acc_ProjectParticipantsProject__r(first:500)"
    }
  ],
  "type": "Acc_Project__c",
  "abstractKey": null
};
})();

(node as any).hash = "22a2ee5768e1384bd63dce2d7d5e72a2";

export default node;
