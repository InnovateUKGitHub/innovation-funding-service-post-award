/**
 * @generated SignedSource<<aec45ec32b2e40578c765c553d905405>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NewDocumentsTableFragment$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly ContentDocument: {
        readonly FileType: {
          readonly value: string | null;
        } | null;
        readonly Title: {
          readonly value: string | null;
        } | null;
      } | null;
    } | null;
  } | null> | null;
  readonly " $fragmentType": "NewDocumentsTableFragment";
};
export type NewDocumentsTableFragment$key = {
  readonly " $data"?: NewDocumentsTableFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewDocumentsTableFragment">;
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
  "name": "NewDocumentsTableFragment",
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
            {
              "alias": null,
              "args": null,
              "concreteType": "ContentDocument",
              "kind": "LinkedField",
              "name": "ContentDocument",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "Title",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StringValue",
                  "kind": "LinkedField",
                  "name": "FileType",
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
  "type": "ContentDocumentLinkConnection",
  "abstractKey": null
};
})();

(node as any).hash = "bef54043a8d11fa20271b8a4198222e7";

export default node;
