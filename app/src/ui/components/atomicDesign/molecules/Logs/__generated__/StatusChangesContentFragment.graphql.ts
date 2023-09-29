/**
 * @generated SignedSource<<cc8b87fcd9da7de1b19e38b06908c43c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StatusChangesContentFragment$data = {
  readonly Acc_CreatedByAlias__c: {
    readonly value: string | null;
  } | null;
  readonly Acc_ExternalComment__c: {
    readonly value: any | null;
  } | null;
  readonly Acc_NewClaimStatus__c: {
    readonly value: string | null;
  } | null;
  readonly Acc_ParticipantVisibility__c: {
    readonly value: boolean | null;
  } | null;
  readonly CreatedDate: {
    readonly value: string | null;
  } | null;
  readonly Id: string;
  readonly " $fragmentType": "StatusChangesContentFragment";
};
export type StatusChangesContentFragment$key = {
  readonly " $data"?: StatusChangesContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StatusChangesContentFragment">;
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
  "name": "StatusChangesContentFragment",
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
      "concreteType": "TextAreaValue",
      "kind": "LinkedField",
      "name": "Acc_NewClaimStatus__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "LongTextAreaValue",
      "kind": "LinkedField",
      "name": "Acc_ExternalComment__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "BooleanValue",
      "kind": "LinkedField",
      "name": "Acc_ParticipantVisibility__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "StringValue",
      "kind": "LinkedField",
      "name": "Acc_CreatedByAlias__c",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DateTimeValue",
      "kind": "LinkedField",
      "name": "CreatedDate",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Acc_StatusChange__c",
  "abstractKey": null
};
})();

(node as any).hash = "a8a324a04e8e92dd9cf1af8264cb2b66";

export default node;
