/**
 * @generated SignedSource<<071aaab33a8636437348d078e15daec0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectStatusFragment$data = {
  readonly Acc_ProjectStatus__c: {
    readonly value: string | null;
  } | null;
  readonly " $fragmentType": "ProjectStatusFragment";
};
export type ProjectStatusFragment$key = {
  readonly " $data"?: ProjectStatusFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectStatusFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectStatusFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PicklistValue",
      "kind": "LinkedField",
      "name": "Acc_ProjectStatus__c",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Acc_Project__c",
  "abstractKey": null
};

(node as any).hash = "5e23441c136145e3d20a613852b85ca2";

export default node;
