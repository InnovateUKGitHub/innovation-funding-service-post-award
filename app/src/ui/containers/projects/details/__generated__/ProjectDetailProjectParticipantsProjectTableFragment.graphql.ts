/**
 * @generated SignedSource<<1cabf8cc8c241512c9f602cfbc1ee628>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectDetailProjectParticipantsProjectTableFragment$data = {
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
      } | null;
    } | null> | null;
  } | null;
  readonly " $fragmentType": "ProjectDetailProjectParticipantsProjectTableFragment";
};
export type ProjectDetailProjectParticipantsProjectTableFragment$key = {
  readonly " $data"?: ProjectDetailProjectParticipantsProjectTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectDetailProjectParticipantsProjectTableFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
                      "selections": (v0/*: any*/),
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
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "PicklistValue",
                  "kind": "LinkedField",
                  "name": "Acc_ParticipantStatus__c",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "BooleanValue",
                  "kind": "LinkedField",
                  "name": "Acc_NonfundedParticipant__c",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Acc_Postcode__c",
                  "plural": false,
                  "selections": (v0/*: any*/),
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

(node as any).hash = "f8495cf1952ba2e72d544ce098e575a4";

export default node;
